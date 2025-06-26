import React from 'react';
import styles from './UserRawsData.module.css';
import { EditFormLayout, TabSettings, KintoneRecord } from '../../kintoneDataType';
import RawData from './RawData';
import Tab from './parts/Tab';

interface Props {
  editFormData: EditFormLayout | null;
  tabSettings: TabSettings;
  setTabSettings: (tabSettings: TabSettings) => void;
  setEditFormData: (editFormData: EditFormLayout | null) => void;
  recordData: KintoneRecord | null;
}

const UserRawsData: React.FC<Props> = ({ 
  editFormData, 
  tabSettings, 
  setTabSettings, 
  setEditFormData,
  recordData
}) => {
  return(
          <div className={styles.userRawsContainer}>
      <div>
        {tabSettings.tabs.map((tab, tabIndex) => (
            <div key={`userRawaData-${tabIndex}`}>
              <Tab 
                tabBoxIndex={tabIndex}
                tab={tab}
                tabSettings={tabSettings}
                setTabSettings={setTabSettings}
                editFormData={editFormData}
                setEditFormData={setEditFormData}
              />
              <div 
                className={styles.tabContentBorder}
                style={{
                  border: `2px solid ${tabSettings.backgroundColor ? tabSettings.backgroundColor : '#66767E'}`,
                }}>
                {editFormData?.layout.map((data, formIndex) => (
                  tab.startRowIndex <= formIndex && formIndex < tabSettings.tabs[tabIndex + 1]?.startRowIndex || tab.startRowIndex <= formIndex && tabSettings.tabs[tabIndex + 1] === undefined ? 
                    <RawData
                      key={`userRawaData-${formIndex}`} 
                      editFormData={editFormData} 
                      setEditFormData={setEditFormData}
                      rowData={data}
                      formIndex={formIndex}
                      tabSettings={tabSettings} 
                      setTabSettings={setTabSettings}
                      recordData={recordData}
                    />
                  : null
                ))}
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default UserRawsData;

