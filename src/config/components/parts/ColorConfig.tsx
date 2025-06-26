import React, { useRef } from 'react';
import { TabSettings } from '../../../kintoneDataType';
import styles from './colorConfig.module.css';
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
    <div className={styles.colorConfigContainer}>
      {font}
      <label className={styles.colorPickerLabel} onClick={handleLabelClick}>
        <div className={styles.colorPickerInputContainer}>
          <div
            className={styles.colorPickerLabelInput}
          >
            {tabSettings?.[colorType as keyof TabSettings] as string ?? '#66767E'}
          </div>
          <span
            className={styles.colorPickerLabelSquare}
            style={{ backgroundColor: tabSettings?.[colorType as keyof TabSettings] as string ?? '#66767E' }}
          />
        </div>
        <ColorizeIcon className={styles.colorIconStyled}/>
        <input
          ref={colorInputRef}
          className={styles.colorPickerLabelColorInput}
          type="color"
          value={tabSettings?.[colorType as keyof TabSettings] as string}
          onChange={handleChangeColor}
        />
      </label>
    </div>
  );
};

export default ColorPickerLabel;
