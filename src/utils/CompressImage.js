const  _compressImage = (image, size, callback) =>{
	    
    //set width from passed value
	const width = size;

	//create new image object
	const img = new Image();

	//set image object source to passed image
	img.src = image;
	
	//set onload event
	img.onload = () =>{
		
		//crate canvas
		const elem = document.createElement('canvas');

		//set widths and heights
		const scaleFactor = width / img.width;
		elem.width = width;
		elem.height = img.height * scaleFactor;

		//draw image on canvase
		const ctx = elem.getContext('2d');
		ctx.drawImage(img,0,0,width, img.height * scaleFactor);

		//create blob from canvas image
		let returnedFile = createBlob(ctx);
		
		//once promise has resolved send blob back to calling component
		returnedFile.then((blob)=>{
			
			callback(blob)
		})
		
		
		
		
	}

}


function createBlob(ctx){
	//create promise to return blob once created
	return new Promise((resolve,reject)=>{
		
		//create blob
		ctx.canvas.toBlob((blob)=>{
			let file = new File([blob], "message_image", {type:'image/jpeg', lastModified:Date.now()});
			resolve(file);
		}, 'image/jpeg', 1)
	})
}

exports._compressImage = _compressImage; 