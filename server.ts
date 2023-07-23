import express, { Express,Request,Response,NextFunction } from 'express';
import multer from 'multer';
import 'dotenv/config';
import sharp from 'sharp';
import cors from 'cors';
import path from 'path';
import { request } from 'http';

const app: Express = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({extended:false,limit:"50mb"}));
app.use(cors({
  origin:"*"
}))

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // console.log(file);
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    // console.log(file)
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 19)
    cb(null, Date.now()+file.originalname)
  }
})
const upload = multer({ storage: storage,limits: { fileSize: 10 * 1024 * 1024 } })

app.get('/',(_req:Request,_res:Response)=>{
  _res.sendFile(path.join(__dirname,'index.html'))
})

app.post('/upload', upload.single("image"),async (_req: Request, _res: Response) => {
  try{
    const imageBuffer = await sharp(_req.file?.path).toBuffer();
    const data = await sharp(imageBuffer)
      .toFormat("webp")
      .webp({
        quality:80
      })
      .toBuffer();
      const convertedImageBase64 = data.toString('base64');
    _res.json(convertedImageBase64)
  }catch(e){
    console.log(e);
    _res.json({
      msg:e
    })
  }
});

app.post('/demo', (req:Request, res:Response) => {
  const {name} = req.body;

  console.log(name);

  res.status(200).json({
    msg:"Hi!"
  })
});

app.get('/download/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join('uploads', filename);
  res.download(filePath, (err) => {
    if (err) {
      console.error(err);
      res.status(404).json({ error: 'File not found.' });
    }
  });
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});