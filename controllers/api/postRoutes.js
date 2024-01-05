const router = require('express').Router();
const { Photo } = require('../../models');
const withAuth = require('../../utils/auth');
const { initializeApp } = require('firebase/app');
const { getStorage, ref, getDownloadURL, uploadBytesResumable } = require('firebase/storage');
const multer = require('multer');
const firebaseConfig = require('../../config/firebase');

const firebase = initializeApp(firebaseConfig);

const storage = getStorage();
const upload = multer({ storage: multer.memoryStorage() })

router.post('/test', upload.single("filename"), async (req, res) => {
  try {
      const storageRef = ref(storage, `files/${req.file.originalname}`);

      //type of file
      const metadata = {
          contentType: req.file.mimetype
      };
      const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);
      const downloadURL = await getDownloadURL(snapshot.ref);

      console.log('File successfully uploaded');
      return res.send({
          message: 'file uploaded to Firebase',
          name: req.file.originalname,
          type: req.file.mimetype,
          downloadURL: downloadURL
      });

  } catch (err) {
      return res.status(400).send(err.message);
  }
});


router.post('/', upload.single("filename"), async (req, res) => {
  try {
    const storageRef = ref(storage, `files/${req.file.originalname}`);

    //type of file
    const metadata = {
        contentType: req.file.mimetype
    };
    const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);
    const downloadURL = await getDownloadURL(snapshot.ref);

    console.log('File successfully uploaded');

    const postData = await Photo.create({
      photo_data: downloadURL,
      user_id: 1,
    })

    return res.send({
        message: 'file uploaded to Firebase',
        name: req.file.originalname,
        type: req.file.mimetype,
        downloadURL: downloadURL
    });

} catch (err) {
    return res.status(400).send(err.message);
}

});

router.put('/:id', withAuth, async (req, res) => {
  console.log("right before route");
  try {
    const postData = await Photo.update({
        ...req.body,
        where: {
          id: req.params.id,
        },
    });

    console.log("after update call");

    res.status(200).json(postData);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const postData = await Photo.destroy({
      where: {
        id: req.params.id,
        // user_id: req.session.user_id,
      },
    });

    if (!postData) {
      res.status(404).json({ message: 'No post found with this id!' });
      return;
    }

    res.status(200).json(postData);
  } catch (err) {
    res.status(500).json(err);
  }
  
  // res.render('profile', {
  //   ...user,
  //   logged_in: true
  // });
});


module.exports = router;
