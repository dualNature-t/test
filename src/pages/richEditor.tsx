/**
 * @file
 * @date 2023-12-21
 * @author haodong.wang
 * @lastModify  2023-12-21
 */
/* <------------------------------------ **** DEPENDENCE IMPORT START **** ------------------------------------ */
/** This section will include all the necessary dependence for this tsx file */
import React, { useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
/* <------------------------------------ **** DEPENDENCE IMPORT END **** ------------------------------------ */
/* <------------------------------------ **** INTERFACE START **** ------------------------------------ */
/** This section will include all the interface for this tsx file */
/* <------------------------------------ **** INTERFACE END **** ------------------------------------ */
/* <------------------------------------ **** FUNCTION COMPONENT START **** ------------------------------------ */
const RichEditor = (): JSX.Element => {
  /* <------------------------------------ **** STATE START **** ------------------------------------ */
  /************* This section will include this component HOOK function *************/
  const editorRef = useRef(null);

  const [value, setValue] = useState("");
  console.log(value);
  /* <------------------------------------ **** STATE END **** ------------------------------------ */
  /* <------------------------------------ **** PARAMETER START **** ------------------------------------ */
  /************* This section will include this component parameter *************/
  /* <------------------------------------ **** PARAMETER END **** ------------------------------------ */
  /* <------------------------------------ **** FUNCTION START **** ------------------------------------ */
  /************* This section will include this component general function *************/
  /* <------------------------------------ **** FUNCTION END **** ------------------------------------ */
  /* <------------------------------------ **** EFFECT START **** ------------------------------------ */
  /************* This section will include this component general function *************/
  /* <------------------------------------ **** EFFECT END **** ------------------------------------ */
  return (
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

        plugins:
          "print preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media template code codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists wordcount imagetools textpattern help emoticons autosave bdmap indent2em autoresize formatpainter axupimgs",
        toolbar:
          "code undo redo | fontsize forecolor backcolor bold italic underline strikethrough link | alignleft aligncenter alignright alignjustify outdent indent | \
        styleselect formatselect fontselect fontsizeselect | bullist numlist | blockquote subscript superscript removeformat | \
        table image media charmap emoticons hr pagebreak insertdatetime print preview | fullscreen | bdmap indent2em lineheight formatpainter axupimgs",
        min_height: 400,
        max_height: 600,
        /*content_css: [ //可设置编辑区内容展示的css，谨慎使用
            '/static/reset.css',
            '/static/ax.css',
            '/static/css.css',
        ],*/
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
            return;
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
        //     var xhr, formData;
        //     xhr = new XMLHttpRequest();
        //     xhr.withCredentials = false;
        //     xhr.open("POST", "/api/cdp/public_images");

        //     xhr.upload.onprogress = function (e) {
        //       progress((e.loaded / e.total) * 100);
        //     };

        //     xhr.onload = () => {
        //       if (xhr.status === 403) {
        //         reject({ message: "HTTP Error: " + xhr.status, remove: true });
        //         return;
        //       }

        //       if (xhr.status < 200 || xhr.status >= 300) {
        //         reject("HTTP Error: " + xhr.status);
        //         return;
        //       }

        //       const json = JSON.parse(xhr.response);

        //       if (!json) {
        //         reject("Invalid JSON: " + xhr.responseText);
        //         return;
        //       }

        //       resolve(json.url);
        //     };

        //     xhr.onerror = function () {
        //       reject(
        //         "Image upload failed due to a XHR Transport error. Code: " +
        //           xhr.status
        //       );
        //     };

        //     formData = new FormData();
        //     formData.append("file", blobInfo.blob(), blobInfo.filename());

        //     xhr.send(formData);
        //   });
        // },
      }}
    />
  );
};
export default RichEditor;
/* <------------------------------------ **** FUNCTION COMPONENT END **** ------------------------------------ */
