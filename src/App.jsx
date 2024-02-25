import React, { useState, useRef } from "react";
import { InboxOutlined } from "@ant-design/icons";
import { message, Upload, Modal } from "antd";
import ImageSplit from "./components/imageSplit";
import { Editor } from "@tinymce/tinymce-react";

const { Dragger } = Upload;
import "./App.css";

const fileToUrl = (file) => {
  return new Promise((resolve) => {
    const fileRender = new FileReader();

    fileRender.onload = (e) => {
      resolve(e.target.result);
    };

    fileRender.readAsDataURL(file);
  });
};

function App() {
  const [messageApi, contextHolder] = message.useMessage();
  const [value, setValue] = useState(
    `快递费金克拉撒旦加快了方式是放到数据库函数的空间是的放家里宽带数据分类是付款记录看到是`
  );
  console.log(value);
  const editorRef = useRef(null);

  const [file, setFile] = useState("");
  const props = {
    name: "file",
    fileList: [],
    onChange: async (info) => {
      const result = await fileToUrl(info.file);
      setFile(result);
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
    beforeUpload() {
      return false;
    },
  };

  return (
    <>
      {contextHolder}
      <Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to upload
        </p>
        <p className="ant-upload-hint">
          Support for a single or bulk upload. Strictly prohibited from
          uploading company data or other banned files.
        </p>
      </Dragger>

      <div className="editor">
        <Editor
          onInit={(evt, editor) => (editorRef.current = editor)}
          value={value}
          onEditorChange={(value) => {
            setValue(value);
          }}
          inline={true}
          tinymceScriptSrc="/tinymce/js/tinymce/tinymce.min.js"
          init={{
            language: "zh_CN",
            statusbar: false,
            menubar: false,
            toolbar: false,
            placeholder: "从这里开始写正文",
            //   toolbar_location: 'bottom',
            toolbar_sticky: true,
            plugins: [
              "autolink",
              "codesample",
              "link",
              "lists",
              "media",
              "powerpaste",
              "table",
              "image",
              "quickbars",
              "codesample",
              "help",
            ],
            quickbars_insert_toolbar: "image media",
            quickbars_selection_toolbar:
              "bold italic forecolor fontsize | quicklink image media",
            // contextmenu:
            //   "undo redo | inserttable | cell row column deletetable | help",
            powerpaste_word_import: "clean",
            powerpaste_html_import: "clean",
            // plugins:
            //   "print preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media template code codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists wordcount imagetools textpattern help emoticons autosave bdmap indent2em autoresize formatpainter axupimgs",
            //   toolbar:
            //     "code undo redo | fontsize forecolor backcolor bold italic underline strikethrough link | alignleft aligncenter alignright alignjustify outdent indent | \
            // styleselect formatselect fontselect fontsizeselect | bullist numlist | blockquote subscript superscript removeformat | \
            // table image media charmap emoticons hr pagebreak insertdatetime print preview | fullscreen | bdmap indent2em lineheight formatpainter axupimgs",
            min_height: 400,
            max_height: 600,
            font_size_formats: "12px 14px 16px 18px 24px 36px 48px 56px 72px",
            // link_list: [
            //   { title: "预置链接1", value: "http://www.tinymce.com" },
            //   { title: "预置链接2", value: "http://tinymce.ax-z.cn" },
            // ],
            // image_list: [
            //   {
            //     title: "预置图片1",
            //     value: "https://www.tiny.cloud/images/glyph-tinymce@2x.png",
            //   },
            //   {
            //     title: "预置图片2",
            //     value: "https://www.baidu.com/img/bd_logo1.png",
            //   },
            // ],
            // image_class_list: [
            //   { title: "None", value: "" },
            //   { title: "Some class", value: "class-name" },
            // ],
            //自定义文件选择器的回调内容
            file_picker_types: "image media",
            file_picker_callback: function (callback, value, meta) {
              console.log(meta.filetype);
              if (meta.filetype === "image") {
                callback("https://www.baidu.com/img/bd_logo1.png", {
                  alt: "My alt text",
                });
              }
              if (meta.filetype === "media") {
                callback("movie.mp4", {
                  source2: "alt.ogg",
                  poster: "https://www.baidu.com/img/bd_logo1.png",
                });
              }
            },
            media_alt_source: false,
            media_poster: false,
            // images_upload_handler: function (blobInfo, progress) {
            //   return new Promise((resolve, reject) => {
            //     // var xhr, formData;
            //     // xhr = new XMLHttpRequest();
            //     // xhr.withCredentials = false;
            //     // xhr.open("POST", "/api/cdp/public_images");
            //     // xhr.upload.onprogress = function (e) {
            //     //   progress((e.loaded / e.total) * 100);
            //     // };
            //     // xhr.onload = () => {
            //     //   if (xhr.status === 403) {
            //     //     reject({
            //     //       message: "HTTP Error: " + xhr.status,
            //     //       remove: true,
            //     //     });
            //     //     return;
            //     //   }
            //     //   if (xhr.status < 200 || xhr.status >= 300) {
            //     //     reject("HTTP Error: " + xhr.status);
            //     //     return;
            //     //   }
            //     //   const json = JSON.parse(xhr.response);
            //     //   if (!json) {
            //     //     reject("Invalid JSON: " + xhr.responseText);
            //     //     return;
            //     //   }
            //     //   resolve(json.url);
            //     // };
            //     // xhr.onerror = function () {
            //     //   reject(
            //     //     "Image upload failed due to a XHR Transport error. Code: " +
            //     //       xhr.status
            //     //   );
            //     // };
            //     // formData = new FormData();
            //     // formData.append("file", blobInfo.blob(), blobInfo.filename());
            //     // xhr.send(formData);
            //   });
            // },
          }}
        />
      </div>

      <ImageSplit
        src={file}
        onOk={(file, callback) => {
          messageApi.open({
            type: "loading",
            content: "上传中...",
            duration: 0,
          });
          setTimeout(() => {
            messageApi.destroy();
            setFile("");
            callback();
          }, 2000);
        }}
      />
    </>
  );
}

export default App;
