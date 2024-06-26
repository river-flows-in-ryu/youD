import React, { memo, useMemo, useRef } from "react";

import dynamic from "next/dynamic";

import "react-quill/dist/quill.snow.css";

interface ReactQuillType {
  getEditor: () => {
    getSelection: (focus: boolean) => { index: number; length: number };
    insertEmbed: (index: number, type: string, value: string) => void;
    setSelection: (index: number) => void;
  };
}

interface FileInfo {
  file: File;
  url: string | undefined;
}

const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill");

    const DynamicReactQuill = ({
      forwardedRef,
      ...props
    }: {
      forwardedRef: React.Ref<any>;
      [key: string]: any;
    }) => <RQ ref={forwardedRef} {...props} />;

    DynamicReactQuill.displayName = "DynamicReactQuill";
    return DynamicReactQuill;
  },
  {
    ssr: false,
  }
);

const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "align",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "background",
  "color",
  "link",
  "image",
  "video",
  "width",
];

const CustomQuill = memo(
  ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (value: string) => void;
  }) => {
    const quillRef = useRef<ReactQuillType>(null);
    const validateImageFile = async (file: File): Promise<boolean> => {
      const fileName = file.name;
      const fileSize = file.size;
      const fileExtension = fileName.split(".").pop()?.toLowerCase() ?? "";
      const invalidChars = /[^a-zA-Z0-9.]/;

      if (!["jpg", "jpeg", "png"].includes(fileExtension)) {
        alert("파일 확장자는 JPEG 또는 PNG 여야 합니다.");
        return false;
      }
      if (fileSize > 2 * 1024 * 1024) {
        alert("파일 용량은 1MB 이하이어야 합니다.");
        return false;
      }
      if (invalidChars.test(fileName) || fileName.includes("_")) {
        alert("파일 이름에 빈칸 및 영어/특수문자가 포함되면 안 됩니다.");
        return false;
      }
      const image = new Image();
      const objectUrl = URL.createObjectURL(file);
      image.src = objectUrl;

      return new Promise((resolve, reject) => {
        image.onload = () => {
          if (image.width < 200 || image.height < 200) {
            alert("이미지의 사이즈는 200x200 픽셀 이상이어야 합니다.");
            resolve(false);
          } else {
            resolve(true);
          }
          URL.revokeObjectURL(objectUrl);
        };

        image.onerror = () => {
          alert("이미지 파일이 유효하지 않습니다.");
          resolve(false);
          URL.revokeObjectURL(objectUrl);
        };
      });
    };

    const handlePresignedUrl = async (file: File) => {
      const isValid = await validateImageFile(file);
      if (!isValid) return;

      const formData = new FormData();
      formData.append("file", file);

      const url = `${process.env.NEXT_PUBLIC_API_URL}/presigned-url/`;
      try {
        const res = await fetch(url, {
          method: "post",
          body: formData,
        });
        const response = await res.json();
        return response?.presigned_url;
      } catch (error) {
        if (error instanceof Error) {
          alert(error?.message);
        }
      }
    };

    const handleImageUpload = async (uploadeUrl: string, file: File) => {
      const res = await fetch(uploadeUrl, {
        method: "put",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });
      return res?.url;
    };

    const imageHandler = async () => {
      const input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("accept", "image/*");
      input.click();

      input.onchange = async () => {
        const files = input.files;
        if (files && files.length > 0) {
          const file = files[0];
          if (file) {
            try {
              const uploadeUrl = await handlePresignedUrl(file);
              if (!uploadeUrl) {
                throw new Error("이미지 업로드 URL을 가져올 수 없습니다.");
              }
              const uploadedUrl = await handleImageUpload(uploadeUrl, file);
              const quill = quillRef?.current?.getEditor();
              if (quill) {
                const range = quill.getSelection(true);
                quill.insertEmbed(range.index, "image", uploadedUrl);
                quill.setSelection(range.index + 1);
              }
            } catch (error) {
              if (error instanceof Error) {
                alert(error?.message);
              }
            }
          }
        }
      };
    };
    const modules = useMemo(
      () => ({
        toolbar: {
          container: [
            ["link", "image", "video"],
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            ["blockquote"],
            [{ list: "ordered" }, { list: "bullet" }],
          ],
          handlers: {
            image: imageHandler,
          },
        },
      }),
      []
    );
    return (
      <ReactQuill
        forwardedRef={quillRef}
        formats={formats}
        modules={modules}
        value={value}
        onChange={onChange}
        style={{ height: "350px", maxHeight: "350px", margin: "0 0 50px 0" }}
      />
    );
  }
);
CustomQuill.displayName = "CustomQuill";

export default CustomQuill;
