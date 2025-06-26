import styles from './Tab.module.css';
import React, { useRef, useEffect} from 'react';
import { TabSettings, EditFormLayout } from '../../../kintoneDataType';
import CloseIcon from '@mui/icons-material/Close';

type Props = {
  tabSettings : TabSettings,
  tab : { startRowIndex: number, tabName: string },
  setTabSettings : (tabSettings: TabSettings) => void,
  tabBoxIndex : number,
  editFormData: EditFormLayout | null,
  setEditFormData: (editFormData: EditFormLayout | null) => void;
}

const Tab = ({ 
  tabSettings, 
  tab, 
  tabBoxIndex, 
  setTabSettings, 
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);
  
  useEffect(() => {
    if(spanRef.current && inputRef.current){
      inputRef.current.style.width = `${spanRef.current.clientWidth}px`;
    }
  },[tabSettings.tabs[tabBoxIndex].tabName])

  function deleteTabGroup(){
    if(tab.startRowIndex === 0){
      return;
    }

    const newTabSettings = {...tabSettings};
    newTabSettings.tabs = newTabSettings.tabs.filter((item) => item.startRowIndex !== tab.startRowIndex);
    setTabSettings(newTabSettings);
  }

  function handleInputChange(e : React.ChangeEvent<HTMLInputElement>){
    setTabSettings({
      ...tabSettings,
      tabs: tabSettings.tabs.map((item) => (
        tab.startRowIndex === item.startRowIndex ? {
          ...item,
          tabName: (e.target as HTMLInputElement).value
        } : {
          ...item,
        }
      ))
    });
  }

  return (
    <>
    <div className={styles.tabNameContainer}>
      <div 
        style={{
          backgroundColor: tabSettings.backgroundColor ? tabSettings.backgroundColor : '#66767E',
        }}
        className={`${styles.tabName} ${tab.startRowIndex === 0 ? styles.tabNameStyled : styles.tabNameStyledWithClose}`}
      >
        <input
          className={`${styles.tab} ${styles.tabInputBase} ${styles.tabInputStyled}`}
          style={{
            backgroundColor: tabSettings.backgroundColor,
            color: tabSettings.fontColor ? tabSettings.fontColor : 'white',
            borderBottomColor: tabSettings.fontColor ?? 'white',
          }}
          value={tabSettings.tabs[tabBoxIndex].tabName}
          maxLength={32}
          onChange={(e) => {
              handleInputChange(e);
          }}
          onBlur={() => {
            if(tabSettings.tabs[tabBoxIndex].tabName === ''){
              setTabSettings({
                ...tabSettings,
                tabs: tabSettings.tabs.map((tab) => (
                  tabSettings.tabs[tabBoxIndex].startRowIndex  !== tab.startRowIndex ? {
                    ...tab
                  } : {
                    ...tab,
                    tabName: `タブ${tabBoxIndex + 1}`
                  }
                ))
              })
            }
          }}
          ref={inputRef}
          autoFocus
        />
        <span 
          className={styles.tabInputTextMeasure}
          ref={spanRef}
        >
          {tabSettings.tabs[tabBoxIndex].tabName === '' ? `タブ${tabBoxIndex + 1}` : tabSettings.tabs[tabBoxIndex].tabName}
        </span>
        <div className={styles.tabActionsContainer}>
          {tab.startRowIndex === 0 ? null :
          <div className={styles.tabMarkDiv}>
            <CloseIcon
              className={`${styles.tabCloseIcon} ${styles.tabCloseIconStyled}`}
              style={{
                color: tabSettings.fontColor ? tabSettings.fontColor : 'white',
              }}
              onClick={deleteTabGroup}
            />
          </div>}
        </div>
      </div>
    </div>
    </>
  )
}

export default Tab;