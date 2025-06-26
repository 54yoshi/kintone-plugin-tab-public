import React, { useState } from 'react';
import styles from './RawData.module.css';
import { EditLayoutItem, TabSettings, EditFormLayout, KintoneRecord, SubtableFieldProperty} from '../../kintoneDataType';

type Props = {
  rowData: EditLayoutItem;
  formIndex: number;
  tabSettings: TabSettings;
  setTabSettings: (tabSettings: TabSettings) => void;
  editFormData: EditFormLayout | null;
  setEditFormData: (editFormData: EditFormLayout | null) => void;
  recordData: KintoneRecord | null;
}

const RawData: React.FC<Props> = ({ 
    rowData, 
    formIndex,
    tabSettings, 
    setTabSettings, 
    recordData
}) => {
  const [onMouse, setOnMouse] = useState<boolean>(false);
  const [isFirstRow, setIsFirstRow] = useState<boolean>(false);

  function findRowIndex(){
    return tabSettings.tabs.some(tab => tab.startRowIndex === formIndex);
  }

  function createTabGroup(nowIndex: number){
    const newTabSettings = {...tabSettings};
    const newTab = {
      startRowIndex: nowIndex,
      tabName: "",
    }
  
    newTabSettings.tabs.push(newTab);
    newTabSettings.tabs.sort((a, b) => a.startRowIndex - b.startRowIndex);
  
    newTabSettings.tabs.forEach((tab, index) => {
      if (tab.tabName === "") {
        let newTabName = `タブ${index + 1}`;
        let counter = 1;
        
        while (newTabSettings.tabs.some((existingTab, existingIndex) => 
          existingIndex !== index && existingTab.tabName === newTabName
        )) {
          counter++;
          newTabName = `タブ${index + 1}-${counter}`;
        }
        
        tab.tabName = newTabName;
      }
    });
    
    setTabSettings(newTabSettings);
  }

  return(
    <>
      <div 
        className={styles.rawContainer}
        onMouseEnter={() => {
          setOnMouse(true);
          setIsFirstRow(findRowIndex);
        }}
        onMouseLeave={() => {
          setOnMouse(false);
        }}
      >
        {onMouse? 
          (
            <div className={styles.tabActionContainer}>
              {isFirstRow ? null : (
                <div 
                  className={styles.createTab}
                  onClick={() => {
                    createTabGroup(formIndex)
                  }}
                >
                  タブを作る
                </div>)
              }
            </div>
          ) : (
            null
          )
        }
        {
          rowData.type === "GROUP" ? 
          <div className={`${styles.fieldType} ${styles.fieldTypeGroup}`}>グループ</div> : 
          rowData.type === "SUBTABLE" ? 
          <div className={`${styles.fieldType} ${styles.fieldTypeSubtable}`}>テーブル</div> : 
          <div className={`${styles.fieldType} ${styles.fieldTypeRow}`}>通常行</div>
        }
        <div className={styles.formRowIndex}>
          {`${formIndex + 1}行目`}
        </div>
        {rowData.type === "GROUP" ? (
          <div className={styles.rowDatasContainer}>         
            <div className={styles.groupDatas}>
              {rowData.layout.map((layout, index) => {
                return(
                  <div key={`RawaData-${index}`}>
                    {layout.fields.map((field) => {
                      return(
                        <div 
                          key={`RawaData-${field.code}`}
                          className={styles.rowDataLabel}
                        >
                          {field.code ? recordData?.properties[field.code]?.label : field.type === 'SPACER' ? 'スペース' : field.type === 'LABEL' ? 'ラベル' : '罫'}
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          </div>
        ) : rowData.type === "SUBTABLE" ? (
          <div className={styles.rowDatasContainer}>         
            <div className={styles.rowDatas}>
              {rowData.fields.map((field) => {
                const subTable = recordData?.properties[rowData.code] as SubtableFieldProperty;
                return(
                  <div 
                    key={`RawaData-${field.code}`} 
                    className={styles.rowDataLabel}
                  >
                    {field.code ? subTable?.fields?.[field.code].label : field.type === 'SPACER' ? 'スペース' : field.type === 'LABEL' ? 'ラベル' : '罫'}
                  </div>
                )
              })}
            </div>
          </div>
        ) : rowData.type === "ROW" ? (
          <div className={styles.rowDatasContainer}>         
            <div className={styles.rowDatas}>
              {rowData.fields.map((field) => {
                return(
                  <div 
                    className={styles.rowDataLabel}
                    key={`RawaData-${field.code}`}
                  >
                   {field.code ? recordData?.properties[field.code]?.label : field.type === 'SPACER' ? 'スペース' : field.type === 'LABEL' ? 'ラベル' : '罫'}
                  </div>
                )
              })}
            </div>
          </div>
        ) : null }
      </div>
    </>
  )
}

export default RawData;