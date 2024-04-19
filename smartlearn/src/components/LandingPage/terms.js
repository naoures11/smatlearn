

// import React, { ReactHtmlParser,useState, useEffect } from 'react';
// import CKEditor from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// npm install @ckeditor/ckeditor5-react @ckeditor/ckeditor5-build-classic


// function Terms() {

//     const [websiteData, setWebsiteData] = useState({});
//     const [editableText, setEditableText] = useState('');

//     const handleEditorChange = (event, editor) => {
//       const data = editor.getData(); // Get the HTML content from the WYSIWYG editor
//       setEditableText(data); // Update the editable text state
//     };

//     useEffect(() => {
//       fetchWebsiteData(); // Fetch website data when the component mounts
//     }, []);

//     const fetchWebsiteData = () => {
//       fetch('http://localhost:3001/website')
//         .then((response) => response.json())
//         .then((data) => {
//           setWebsiteData(data);
//           setEditableText(data.terms_and_conditions);
//           console.log(data);

//         })
//         .catch((error) => {
//           console.error('Error fetching website data:', error);
//         });
//     };

//   return (
//     <>   <CKEditor
//     editor={ClassicEditor}
//     data={editableText}
//     onChange={handleEditorChange}
//   />
//       <div dangerouslySetInnerHTML={{__html: websiteData.terms_and_conditions }}>{ }</div>
//   </>

//   )
// }

// export default Terms

// https://html-online.com/editor/

import React, { ReactHtmlParser,useState, useEffect } from 'react';

function Terms() {

    const [websiteData, setWebsiteData] = useState({});

    useEffect(() => {
      fetchWebsiteData(); // Fetch website data when the component mounts
    }, []);

    const fetchWebsiteData = () => {
      fetch('http://localhost:3001/website')
        .then((response) => response.json())
        .then((data) => {
          setWebsiteData(data);
          console.log(data);

        })
        .catch((error) => {
          console.error('Error fetching website data:', error);
        });
    };

  return (
    <div dangerouslySetInnerHTML={{__html: websiteData.terms_and_conditions }}>{ }</div>
  )
}

export default Terms
