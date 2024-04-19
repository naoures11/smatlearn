import React from 'react';
import './PopUpChapter.css';

function PopUpChapter({
  title,
  value,
  videoValue,
  textValue,
  onChange,
  onSave,
  onCancel,
  onEdit,
  editValue,
}) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  return (
    <div className='popup-container-add-course popup-chapter'>
      <div className='popup-overlay'></div>
      <div className='popup-content'>
        <div className='PopupHeader'>
          <h2>{title}</h2>

        </div>
        <div className='popup-body'>
          <input
            type='text'
            name='newChapterName'
            placeholder="Chapter's Name"
            value={value}
            onChange={handleInputChange}
          />
          <input
            type='text'
            name='newChapterVideo'
            placeholder='Video URL'
            value={videoValue}
            onChange={handleInputChange}
          />
          <textarea
            type='text'
            name='newChapterText'
            placeholder='Text'
            value={textValue}
            onChange={handleInputChange}
          />
        </div>
        <div className='popup-footer'>
          <button className='CancelButton' onClick={onCancel}>
            Cancel
          </button>
          <button className='SaveButton' onClick={onSave}>
            {editValue ? 'Save' : 'Add'}
          </button>
        </div>
      </div>


    </div>
  );
}

export default PopUpChapter;
