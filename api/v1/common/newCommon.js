



function validateFile(sampleFile, res) {
    const allowedTypes = ["jpg", "jpeg", "png"];
    const fileType = sampleFile.name.split('.').pop().toLowerCase();
  
    // Validate file type
    if (!allowedTypes.includes(fileType)) {
      return res.status(400).send({
          success: false,
          status: 400,
          message: 'Invalid file type.'
       });
    }
  
    // Validate file size
    const maxSize = 15 * 1024 * 1024; 
    if (sampleFile.size > maxSize) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: 'Invalid file type.'
     });
    }
  
    return true;
  }



  module.exports = {
    validateFile
}