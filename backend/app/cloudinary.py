import cloudinary
import cloudinary.uploader
import cloudinary.api
from app import app


def cloudinary_upload_avatar(file):
    try:
        upload_result = cloudinary.uploader.upload(file, folder="avatars")
        return upload_result
    except cloudinary.exceptions.Error as e:
        app.logger.error(f"Cloudinary Error: {e}")
        raise RuntimeError("Cloudinary upload error")
    except Exception as e:
        app.logger.error(f"Unexpected Error: {e}")
        raise RuntimeError("Unexpected error while uploading avatar")
