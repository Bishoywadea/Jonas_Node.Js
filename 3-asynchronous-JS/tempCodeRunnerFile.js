fs.readFile('./dog.txt','utf-8',(err,data)=>{
    print(data);
    superagent.get(`https://dog.ceo/api/breed/${data}/images/random`).end((err, response) => {
        if (err) {
        console.error('Error:', err);
        } 
        else {
        print(response.body.message);
        fs.writeFile('./dog-image.txt', response.body.message, 'utf-8', (err) => {
            if (err) {
                print('Error saving the image:', err);
            } else {
                print('Image downloaded and saved:');
            }
        });
        }
    });
});