import {createClient} from '@supabase/supabase-js';

const anon_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlandyZWhpaXhqemh1ampienB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI3OTAyNjAsImV4cCI6MjA1ODM2NjI2MH0.8qMa-vENTsxQwC1Rr3q7Xn7WOQhYvehsErxZomVvcV8";

const supabse_url = "https://xejwrehiixjzhujjbzpv.supabase.co";

const supabase = createClient(supabse_url,anon_key);

export default function mediaUpload(file){

    return new Promise((resolve,reject)=>{
        if(file === null){
            reject("No file selected!")
        }else{
            const timeStamp = new Date().getTime();
            const fileName = timeStamp+file.name;

            supabase.storage.from("images").upload(fileName,file,{
                cacheControl:'3600',
                upsert:false
            }).then(()=>{
                const pulicUrl = supabase.storage.from("images").getPublicUrl(fileName).data.publicUrl;
                resolve(pulicUrl);
            }).catch((error)=>{
                reject("Error uploading file!");
            })
        }
    });

    
}