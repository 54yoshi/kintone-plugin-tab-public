import React, { useRef } from 'react';
import { TabSettings } from '../../../kintoneDataType';
import './colorConfig.css';
import ColorizeIcon from '@mui/icons-material/Colorize';

type Props = {
  font: string;
  colorType: string;
  tabSettings: TabSettings;
  setTabSettings: (tabSettings: TabSettings) => void;
};

const ColorPickerLabel = ({ font, colorType, tabSettings, setTabSettings }: Props) => {
  const colorInputRef = useRef<HTMLInputElement>(null);

  // カラーピッカー変更時の処理
  const handleChangeColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTabSettings({
      ...tabSettings,
      [colorType]: e.target.value,
    });
  };

  // ラベル全体をクリックしたときにカラーピッカーを開く
  const handleLabelClick = () => {
    if (colorInputRef.current) {
      colorInputRef.current.click();
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '0.62rem',
      fontSize: '14px',
      height: '100%',
    }}>
      {font}
      <label className="colorPickerLabel" onClick={handleLabelClick}>
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingRight: '20px',
          }}
        >
          <div
            className="colorPickerLabel-input"
          >
            {tabSettings?.[colorType as keyof TabSettings] as string ?? '#66767E'}
          </div>
          <span
            className="colorPickerLabel-square"
            style={{ backgroundColor: tabSettings?.[colorType as keyof TabSettings] as string ?? '#66767E' }}
          />
        </div>
        <ColorizeIcon 
          style={{
            color: 'black',
            fontSize: '20px',
        }}/>
        <input
          ref={colorInputRef}
          className="colorPickerLabel-colorInput"
          type="color"
          value={tabSettings?.[colorType as keyof TabSettings] as string}
          onChange={handleChangeColor}
        />
      </label>
    </div>
  );
};

export default ColorPickerLabel;
