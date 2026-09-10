import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { formatSize } from "../../lib/utils";

interface FileUploaderProps {
  onFileSelect?: (file: File | null) => void;
}

const MAX_FILE_SIZE = 20 * 1024 * 1024;

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0] || null;
      onFileSelect?.(file);
    },
    [onFileSelect],
  );

  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    onDrop,
    multiple: false,
    accept: { "application/pdf": [".pdf"] },
    maxSize: MAX_FILE_SIZE,
  });

  const file = acceptedFiles[0] || null;

  return (
    <div className="reality-w-full reality-gradient-border">
      <div {...getRootProps()}>
        <input {...getInputProps()} aria-label="Upload resume PDF" />

        {file ? (
          <div
            className="reality-uploader__file"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="reality-uploader__file-info">
              <img src="/images/pdf.png" alt="" width={40} height={40} />
              <div>
                <p className="reality-uploader__file-name">{file.name}</p>
                <p className="reality-uploader__file-size">
                  {formatSize(file.size)}
                </p>
              </div>
            </div>
            <button
              type="button"
              className="reality-uploader__remove"
              onClick={() => onFileSelect?.(null)}
              aria-label="Remove selected file"
            >
              <img src="/icons/cross.svg" alt="" width={16} height={16} />
            </button>
          </div>
        ) : (
          <div className="reality-uploader__dragarea">
            <img
              src="/icons/info.svg"
              alt=""
              className="reality-uploader__icon"
            />
            <p className="reality-form-hint">
              <strong>Click to upload</strong> or drag and drop
            </p>
            <p className="reality-form-hint">
              PDF (max {formatSize(MAX_FILE_SIZE)})
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploader;
