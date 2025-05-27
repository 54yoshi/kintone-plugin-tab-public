import './tab.css';
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

export const Tab = ({ 
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
    <div className='tabNameContainer'>
      <div 
        style={{
          backgroundColor: tabSettings.backgroundColor ? tabSettings.backgroundColor : '#66767E',
          padding: `${tab.startRowIndex === 0 ? '4px 20px' : '4px 10px 4px 20px'}`,
        }}
        className='tabName'
      >
        <input
          className="tab"
          style={{
            backgroundColor: tabSettings.backgroundColor,
            color: tabSettings.fontColor ? tabSettings.fontColor : 'white',
            borderBottom: `1px solid ${tabSettings.fontColor ?? 'white'}`,
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
          style={{
            position: 'absolute',
            visibility: 'hidden',
            height: 'auto',
            whiteSpace: 'nowrap',
            fontSize: '15px',
            padding: '5px 0 2px 0',
          }}
          ref={spanRef}
        >
          {tabSettings.tabs[tabBoxIndex].tabName === '' ? `タブ${tabBoxIndex + 1}` : tabSettings.tabs[tabBoxIndex].tabName}
        </span>
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '7px'
          }}
        >
          {tab.startRowIndex === 0 ? null :
          <div className='tabMarkDiv'>
            <CloseIcon
              style={{
                fontSize: '20px',
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