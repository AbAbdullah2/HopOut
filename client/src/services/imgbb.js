import axios from 'axios';
const API_KEY = process.env.REACT_APP_IMGBB_KEY;
const BASE_URL = `https://api.imgbb.com/1/upload?expiration=600&key=${API_KEY}`;
// You should never save API key directly in source code

// Upload to imgbb 
async function uploadImg(img) {
    const form = new FormData();
    form.append("image", img)

    const response = await axios.post(`${BASE_URL}`, form)
    .catch(function (error) {
        console.log(error);
        });
    return response;
}

export { uploadImg  }
  