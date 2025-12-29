
import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export interface UploadedFile {
    id: string; // Database ID
    name: string;
    size: number;
    mimeType: string;
    path: string; // Storage Path
    url: string; // Public URL
}

export const FileService = {
    /**
     * Uploads a file to Supabase Storage and records it in the database options.
     */
    async uploadFile(file: File | Blob, userId: string, conversionId?: string, isOutput: boolean = false): Promise<UploadedFile> {
        // 1. Upload to Storage
        // Handle Blob name
        const fileNameStr = (file as File).name || `output_${Date.now()}.${isOutput ? 'pdf' : 'dat'}`;
        const fileExt = fileNameStr.split('.').pop();
        const fileName = `${userId}/${uuidv4()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { data: storageData, error: storageError } = await supabase.storage
            .from('files')
            .upload(filePath, file);

        if (storageError) {
            throw new Error(`Storage upload failed: ${storageError.message}`);
        }

        // 2. Get Public URL
        const { data: { publicUrl } } = supabase.storage
            .from('files')
            .getPublicUrl(filePath);

        // 3. Save metadata to database
        const { data: docData, error: docError } = await supabase
            .from('documents')
            .insert({
                user_id: userId,
                name: fileNameStr,
                size: file.size,
                mime_type: file.type || 'application/octet-stream',
                storage_path: filePath,
                is_output: isOutput,
                conversion_id: conversionId
            })
            .select()
            .single();

        if (docError) {
            // Cleanup storage if DB fails
            await supabase.storage.from('files').remove([filePath]);
            throw new Error(`Database record failed: ${docError.message}`);
        }

        return {
            id: docData.id,
            name: docData.name,
            size: docData.size,
            mimeType: docData.mime_type,
            path: docData.storage_path,
            url: publicUrl
        };
    },

    /**
     * Creates a conversion job record.
     */
    async createConversionJob(userId: string, title: string, actionType: string, inputFormat: string, outputFormat: string, fileId?: string) {
        const { data, error } = await supabase
            .from('conversions')
            .insert({
                user_id: userId,
                title,
                action_type: actionType,
                input_format: inputFormat,
                output_format: outputFormat,
                status: 'pending'
            })
            .select()
            .single();

        if (error) throw error;

        // If fileId is provided, link it? 
        // Our schema links `documents` -> `conversion_id`, not the other way around. 
        // So we update the document to point to this conversion.
        if (fileId) {
            await supabase
                .from('documents')
                .update({ conversion_id: data.id })
                .eq('id', fileId);
        }

        return data;
    },

    /**
     * Lists user files.
     */
    async getUserFiles(userId: string) {
        const { data, error } = await supabase
            .from('documents')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    /**
     * Deletes a file from database and storage.
     */
    async deleteFile(fileId: string, storagePath: string) {
        // 1. Delete from storage
        const { error: storageError } = await supabase.storage
            .from('files')
            .remove([storagePath]);

        if (storageError) console.error('Storage delete error:', storageError);

        // 2. Delete from database
        const { error: dbError } = await supabase
            .from('documents')
            .delete()
            .eq('id', fileId);

        if (dbError) throw dbError;
    },

    /**
     * User conversion history with output documents
     */
    async getConversionHistory(userId: string) {
        // Fetch conversions
        const { data: conversions, error } = await supabase
            .from('conversions')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Fetch output files for these conversions
        // We can do this efficiently by getting all documents linked to these conversions
        // or by a join if supported, but two queries is fine for now.
        const conversionIds = conversions.map(c => c.id);
        const { data: documents } = await supabase
            .from('documents')
            .select('*')
            .in('conversion_id', conversionIds)
            .eq('is_output', true);

        // Merge
        return conversions.map(c => {
            const outputDoc = documents?.find(d => d.conversion_id === c.id);
            return {
                ...c,
                output_document: outputDoc
            };
        });
    },

    async deleteConversion(conversionId: string) {
        // Also delete associated output documents if we want strict cleanup
        // First get the docs
        const { data: docs } = await supabase
            .from('documents')
            .select('*')
            .eq('conversion_id', conversionId);

        if (docs) {
            for (const doc of docs) {
                // Delete file from storage
                await supabase.storage.from('files').remove([doc.storage_path]);
            }
            // Delete DB records
            await supabase.from('documents').delete().eq('conversion_id', conversionId);
        }

        // Delete conversion
        await supabase.from('conversions').delete().eq('id', conversionId);
    }
};
