
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
    async uploadFile(file: File, userId: string): Promise<UploadedFile> {
        // 1. Upload to Storage
        const fileExt = file.name.split('.').pop();
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
                name: file.name,
                size: file.size,
                mime_type: file.type,
                storage_path: filePath,
                is_output: false
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
     * User conversion history
     */
    async getConversionHistory(userId: string) {
        const { data, error } = await supabase
            .from('conversions')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    }
};
