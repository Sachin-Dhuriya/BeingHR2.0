import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TextEditor.css";

export default function TextEditor({ onChange }) {
  const [content, setContent] = useState("");
  const [alignment, setAlignment] = useState("left");
  const [fontSize, setFontSize] = useState("16");
  const [textColor, setTextColor] = useState("#000000");

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/events/add-event`)
      .then((response) => {
        if (response.data && response.data.text) {
          setContent(response.data.text);
        } else {
          console.error("Invalid response structure", response.data);
        }
      })
      .catch((err) => console.error("Error fetching text", err));
  }, []);

  const applyFormat = (command, value = null) => {
    document.execCommand(command, false, value);
  };

  const handleInput = (e) => {
    const htmlContent = e.target.innerHTML;
    setContent(htmlContent);
    if (onChange) {
      onChange(htmlContent); // Call the onChange prop to update parent component
    }
  };

  const handleSubmit = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/events/add-event`, { text: content });
      console.log("Text saved successfully");
    } catch (err) {
      console.error("Error saving text", err);
    }
  };

  return (
    <div className="container">
      {/* Formatting Toolbar */}
      <div className="toolbar">
        <button onClick={() => applyFormat("bold")} className="btn">B</button>
        <button onClick={() => applyFormat("italic")} className="btn">I</button>
        <button onClick={() => applyFormat("underline")} className="btn">U</button>
        <button onClick={() => applyFormat("strikeThrough")} className="btn">S</button>
      </div>

      {/* Text Alignment Toolbar */}
      <div className="toolbar">
        <button onClick={() => applyFormat("justifyLeft")} className="btn">Left</button>
        <button onClick={() => applyFormat("justifyCenter")} className="btn">Center</button>
        <button onClick={() => applyFormat("justifyRight")} className="btn">Right</button>
      </div>

      {/* Font Size and Color */}
      <div className="toolbar">
        <input
          type="number"
          min="12"
          max="40"
          value={fontSize}
          onChange={(e) => setFontSize(e.target.value)}
          onBlur={() => applyFormat("fontSize", fontSize)}
          className="input"
          placeholder="Font Size"
        />
        <input
          type="color"
          value={textColor}
          onChange={(e) => applyFormat("foreColor", e.target.value)}
          className="input"
        />
      </div>

      {/* Editable Content Area */}
      <div
        id="editor"
        placeholder= "Details about event"
        contentEditable
        className="editor"
        style={{ textAlign: alignment }}
        onInput={handleInput}
        dangerouslySetInnerHTML={{ __html: content }}  // Display fetched content
      ></div>

      <button onClick={handleSubmit} className="submit-btn">Submit</button>
    </div>
  );
}
