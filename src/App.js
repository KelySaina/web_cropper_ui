import React, { useState } from 'react';
import axios from 'axios';
import { Button, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ReplayIcon from '@mui/icons-material/Replay';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import CircularProgress from '@mui/joy/CircularProgress';
import ChecklistIcon from '@mui/icons-material/Checklist';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AvTimerIcon from '@mui/icons-material/AvTimer';
import PhotoSizeSelectActualIcon from '@mui/icons-material/PhotoSizeSelectActual';
import TypeWriterEffectComponent from './TypeWriterEffectComponent';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function ImageUpload() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imgUrl, setImgUrl] = useState(null);
  const [filename, setFilename] = useState('');
  const [croppedArray, setCroppedArray] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [up, setUp] = useState(false)
  const [selItem, setSelItem] = useState('/img/check.png')
  const host = "127.0.0.1"

  const handleCheckboxChange = (url) => {
    if (selectedImages.includes(url)) {
      setSelectedImages(selectedImages.filter(item => item !== url));
    } else {
      setSelectedImages([...selectedImages, url]);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
    setFilename(file.name);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (file.name.toLowerCase().endsWith(".pdf")) {
          setPreviewImage('/img/pdf.png');
        } else {
          setPreviewImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    // Reset state variables
    setSelectedImage(null);
    setImgUrl(null);
    setFilename('');
    setCroppedArray([]);
    setSelectedImages([]);
    setPreviewImage(null);
    setUp(false);
    setSelItem('/img/check.png')

    const formData = new FormData();
    formData.append('image', selectedImage);

    axios.post(`http://${host}:5000/upload`, formData)
      .then(response => {
        if (response.data.msg === 'uploaded') {
          setImgUrl(response.data.url);
          setSelItem(response.data.url);
          setUp(true)
        }
        const formDataCrop = new FormData();
        formDataCrop.append('name', filename);

        axios.post(`http://${host}:5000/crop`, formDataCrop)
          .then(response => {
            setCroppedArray(response.data.urls)
          })
          .catch(error => {
            toast.error("An error occured", {
              position: toast.POSITION.TOP_RIGHT
            });
            setSelectedImage(null);
            setImgUrl(null);
            setFilename('');
            setCroppedArray([]);
            setSelectedImages([]);
            setPreviewImage(null);
            setUp(false);
            setSelItem('/img/check.png')
          }
          );
      })
      .catch(error => {
        toast.error("An error occured", {
          position: toast.POSITION.TOP_RIGHT
        });
        setSelectedImage(null);
        setImgUrl(null);
        setFilename('');
        setCroppedArray([]);
        setSelectedImages([]);
        setPreviewImage(null);
        setUp(false);
        setSelItem('/img/check.png')
      });
  };

  const getSelURL = () => {
    let items = selectedImages.map(url => url.replace(`http://${host}:5000/`, ''));

    axios.post(`http://${host}:5000/process_items`, {
      items: items
    })
      .then(response => {
        const archive_path = response.data.archive_path
        window.open(`http://${host}:5000/${archive_path}`, "_blank");
      })
      .catch(error => {
        toast.error("An error occured", {
          position: toast.POSITION.TOP_RIGHT
        });
        setSelectedImage(null);
        setImgUrl(null);
        setFilename('');
        setCroppedArray([]);
        setSelectedImages([]);
        setPreviewImage(null);
        setUp(false);
        setSelItem('/img/check.png')
      });
  }

  const handleSelectAll = () => {
    const allUrls = croppedArray.map(url => `http://${host}:5000/` + url);
    setSelectedImages(allUrls);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', textAlign: 'center' }}>
      <div style={{ width: '40%', padding: '2px', background: '#E8E8E8', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {
          imgUrl ? (
            <>
              <div style={{ width: '80%', border: '1px dashed #666666', height: '90vh', margin: '5px 0' }}>
                <img src={selItem} alt='selectedItem' width={'100%'} height={'100%'} />
              </div>
              <div style={{ width: '80%' }}>
                <Button startIcon={<ReplayIcon />} onClick={() => { setImgUrl(null); setCroppedArray([]); setFilename(null); setPreviewImage(null); setUp(false) }} variant='outlined' >Another</Button>
              </div>
            </>
          ) :
            (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {
                  filename ? (
                    <Typography>Filename: {filename}</Typography>
                  ) : (
                    <Typography style={{ color: '#666666' }} ><b>Upload a file</b></Typography>
                  )
                }
                <form onSubmit={handleSubmit}>
                  <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>
                    {previewImage ? (
                      <>
                        <div style={{ width: '80%', border: '1px dashed #666666', height: '80vh', margin: '15px 0' }}>
                          <img src={previewImage} alt="Preview" width={'100%'} height={'100%'} />
                        </div>
                        <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Button endIcon={<CloudUploadIcon />} sx={{ width: '45%' }} variant='contained' type="submit" size='large'>START</Button>
                          <Button startIcon={<ReplayIcon />} sx={{ width: '45%' }} onClick={() => { setImgUrl(null); setCroppedArray([]); setFilename(null); setPreviewImage(null); setUp(false); setSelectedImages([]) }} variant='outlined' size='large'>Another</Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                            id="fileInput"
                          />
                        </div>
                        <div style={{ width: '80%', border: '1px dashed #666666', height: '80vh', margin: '15px 0' }}>
                          <label htmlFor="fileInput" style={{ cursor: 'pointer' }}>
                            <div>
                              <img src='/img/up.png' alt='up' width={'100%'} height={'494px'} />
                            </div>
                          </label>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <b><span>Click</span></b> <b><span> <ArrowUpwardIcon /></span></b><b><span>to upload a file</span></b>
                        </div>
                      </>
                    )}
                  </div>
                </form>
              </div>
            )
        }
      </div >
      <div style={{ width: '60%', background: '#EFF7F7' }}>
        {croppedArray.length > 0 ? (
          <>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }} >
                <Typography sx={{ fontSize: '20px' }}><b>{selectedImages.length}/{croppedArray.length} images selected</b></Typography>
                <Button startIcon={<ChecklistIcon />} onClick={handleSelectAll} variant='contained'><b>Select All</b></Button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ overflow: 'auto', maxWidth: '100%', maxHeight: '500px' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {
                      croppedArray.map((url, i) => (
                        <div key={i} style={{ flex: '0 0 auto', margin: '0 10px' }}>
                          <label>
                            <input
                              type="checkbox"
                              checked={selectedImages.includes(`http://${host}:5000/` + url)}
                              onChange={() => { handleCheckboxChange(`http://${host}:5000/` + url); setSelItem(`http://${host}:5000/` + url) }}
                            />
                            <img
                              src={`http://${host}:5000/` + url}
                              width={150}
                              height={180}
                              alt={i}
                              style={{ border: selectedImages.includes(`http://${host}:5000/` + url) ? '3px solid darkblue' : 'none' }}
                            />
                            <p>{url.split('/')[3]}</p>
                          </label>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>
              <div style={{ margin: '10px' }}>
                <Button variant='contained' sx={{ background: '#00FF00' }} endIcon={<SaveAltIcon />} onClick={getSelURL}><Typography>Save {selectedImages.length} images</Typography></Button>
              </div>
            </div>
          </>
        ) : (
          <>
            {
              up ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', height: '100%' }}>
                    <div>
                      <Typography>Processing</Typography>
                      <br />
                      <CircularProgress size='lg' />
                    </div>
                    <div style={{ fontSize: '40px', fontWeight: 'bolder', color: '#0000BB', margin: '30px' }}>
                      <TypeWriterEffectComponent text="Upload your image:Wait for a couple of minutes:Select the images you want to keep:Save the compressed file" />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                    <h2>How to use Cropper?</h2><br />
                    <List>
                      <ListItem disablePadding>
                        <ListItemButton>
                          <ListItemIcon>
                            <PhotoSizeSelectActualIcon />
                          </ListItemIcon>
                          <ListItemText primary="Select an Image" />
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton>
                          <ListItemIcon>
                            <CloudUploadIcon />
                          </ListItemIcon>
                          <ListItemText primary="Click START button" />
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton>
                          <ListItemIcon>
                            <AvTimerIcon />
                          </ListItemIcon>
                          <ListItemText primary="Wait to process image (Up to 2 minutes)" />
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton>
                          <ListItemIcon>
                            <ChecklistIcon />
                          </ListItemIcon>
                          <ListItemText primary="Select all images you want to save" />
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton>
                          <ListItemIcon>
                            <SaveAltIcon />
                          </ListItemIcon>
                          <ListItemText primary="Click SAVE button to download selected images" />
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton>
                          <ListItemIcon>
                            <ReplayIcon />
                          </ListItemIcon>
                          <ListItemText primary="Click ANOTHER button to upload a different image" />
                        </ListItemButton>
                      </ListItem>
                    </List>
                  </div>
                </>
              )
            }
          </>
        )}
      </div>
      <ToastContainer />
    </div >
  );
}

export default ImageUpload;
