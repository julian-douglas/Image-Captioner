from PIL import Image
from transformers import BlipProcessor, BlipForConditionalGeneration
from fastapi import FastAPI, File, UploadFile
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from fastapi.templating import Jinja2Templates
from jinja2 import Environment, FileSystemLoader


# Set up Jinja2 environment
template_env = Environment(loader=FileSystemLoader(""))
upload_form = template_env.get_template("index.html")

current_dir = os.getcwd()

application = app = FastAPI()
application.mount("/uploaded_images", StaticFiles(directory="uploaded_images"), name="uploaded_images")
templates = Jinja2Templates(directory=current_dir)

# CORS configuration
origins = ["*"] 
application.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-large")
model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-large")

@application.get("/", response_class=HTMLResponse)
async def get_root():
    return templates.TemplateResponse("index.html", {"request": "root"})

@application.post("/predict", response_class=HTMLResponse)
async def predict(file: UploadFile = File(...)):
    contents = await file.read()

    # Save the uploaded image to the 'uploaded_images' directory
    save_path = Path("uploaded_images") / file.filename
    with open(save_path, "wb") as image_file:
        image_file.write(contents)

    raw_image = Image.open(save_path).convert('RGB')

    text = ""
    inputs = processor(raw_image, text, return_tensors="pt")

    out = model.generate(**inputs)
    caption = processor.decode(out[0], skip_special_tokens=True)

    display_style = "" if caption else "none"

    return JSONResponse(content={"caption": caption, "display_style": display_style})
