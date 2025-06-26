import styles from './Config.module.css';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { isEqual, cloneDeep } from 'lodash';
import { KintoneRecord, FormLayout, EditFormLayout, TabSettings } from '../kintoneDataType';
import { findSpaceField, getLowerSpaceIndex } from './utils/handleRecords';
import { KINTONE_REST, KINTONE_UI_URLS } from './constants/endpoint';
import Toast from './components/parts/Toast';
import UserRawsData from './components/UserRawsData';
import DropDown from './components/parts/DropDown';
import ColorConfig from './components/parts/ColorConfig';
import CancelButton from './components/parts/CancelButton';
import SubmitButton from './components/parts/SubmitButton';
import Alert from './components/parts/Alert';

const PLUGIN_ID = kintone.$PLUGIN_ID;
const appId = kintone.app.getId();
const baseUrl = location.origin;

type PluginConfig = {
  tabSettings: string;
  editFormData: string | null;
}

const Config: React.FC = () => {
  const [formData, setFormData] = useState<FormLayout | null>(null);
  const [recordData, setRecordData] = useState<KintoneRecord | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);
  const [isClean, setIsClean] = useState<boolean>(true);
  const [openAlertToast, setOpenAlertToast] = useState<boolean>(false);
  const [editFormData, setEditFormData] = useState<EditFormLayout | null>(null);
  const [tabSettings, setTabSettings] = useState<TabSettings>({
    isFollow: false, 
    backgroundColor: '#66767E', 
    fontColor: '#ffffff', 
    spaceField: '', 
    tabs: [{startRowIndex: 0, tabName: 'タブ１'}]
  });

  const initialConfigRef = useRef<{ tabSettings: TabSettings; editFormData: EditFormLayout | null }>(null);

  useEffect(() => {
    const config = kintone.plugin.app.getConfig(PLUGIN_ID);
    const body = { app: appId };

    const { initialTabSettings, initialEditFormData } = parsePluginConfig(config);
  
    setTabSettings(initialTabSettings);
    setEditFormData(initialEditFormData);
  
    initialConfigRef.current = {
      tabSettings: cloneDeep(initialTabSettings),
      editFormData: cloneDeep(initialEditFormData),
    };

    const fetchFormLayout = kintone.api(
      kintone.api.url(KINTONE_REST.GET_FORM_LAYOUT_PREVIEW, true),
      'GET',
      body
    );
  
    const fetchRecordData = kintone.api(
      kintone.api.url(KINTONE_REST.GET_FORM_FIELDS_PREVIEW, true),
      'GET',
      body
    );

    Promise.all([fetchFormLayout, fetchRecordData])
      .then(([formLayout, recordData]) => {
        setFormData(formLayout);
        setRecordData(recordData);
      })
      .catch(error => console.error('Error fetching JSON:', error));
  }, []);

  useEffect(() => {
    if(formData && editFormData){
      if(!findSpaceField(formData, tabSettings)){
        setTabSettings({
          isFollow: false, 
          backgroundColor: '#66767E', 
          fontColor: '#ffffff', 
          spaceField: '', 
          
          tabs: [{startRowIndex: 0, tabName: 'タブ１'}]
        });
        setEditFormData(null); 
        setOpenAlertToast(true);
        return;
      }
      if(tabSettings.spaceField !== ''){
        const spaceIndex = getLowerSpaceIndex(formData, tabSettings?.spaceField);
        const lowerLayout = formData.layout.slice(spaceIndex + 1);
        if(lowerLayout !== null){
          setEditFormData({
            layout: lowerLayout,
            revision: formData.revision
          });
        }
      }
    }
  }, [formData]);

  useEffect(() => {
    const newConfigData = {
      tabSettings: {...tabSettings}, 
      editFormData:{...editFormData}
    }
    setIsClean(isEqual(newConfigData, initialConfigRef.current));
  }, [tabSettings, editFormData]);

  const handleUnload = useCallback((e: BeforeUnloadEvent) => {
    if(!isClean){
      e.preventDefault();
    }
  }, [isClean]);
  
  
  function parsePluginConfig(config: PluginConfig){
    const initialTabSettings = config.tabSettings ? JSON.parse(config.tabSettings) : {
      isFollow: false, 
      backgroundColor: '#66767E', 
      fontColor: '#ffffff', 
      spaceField: '', 
      tabs: [{startRowIndex: 0, tabName: 'タブ１'}]
    };

    const initialEditFormData = config.editFormData ? JSON.parse(config.editFormData) : null;
    return {
      initialTabSettings,
      initialEditFormData
    };
  }

  function handleSave(){
    kintone.plugin.app.setConfig({
      tabSettings: JSON.stringify(tabSettings), 
      editFormData: editFormData ? JSON.stringify(editFormData) : ''
    });
  };

  function handleCancel(){
    if(!isClean) {
      setIsAlertOpen(true);
    } else {
      const pluginListUrl = `${baseUrl}${KINTONE_UI_URLS.ADMIN_APP_PLUGINS}/${appId}${KINTONE_UI_URLS.PLUGIN_LIST_PATH}`;
      if (window.top) {
        window.top.location.href = pluginListUrl;
      } else {
        window.location.href = pluginListUrl;
      }
    }
  };

  return (
    <div className={styles.config}>
      {isAlertOpen && (
        <Alert 
          setIsAlertOpen={setIsAlertOpen}
          handleUnload={handleUnload}
          setIsClean={setIsClean}
        />
      )}
      <div className={styles.configHeader}>
        <div 
          className={styles.configHeaderContents}
        >
          <DropDown 
            font='タブ開始位置' 
            fetchFormData={formData}
            fetchRecordData={recordData}
            setEditFormData={setEditFormData}
            tabSettings={tabSettings}
            setTabSettings={setTabSettings}
          />
          <div className={styles.headerConfigContainer}>
                          <div className={styles.colorConfigContainer}>
              <ColorConfig 
                font='タブ背景色' 
                colorType='backgroundColor' 
                tabSettings={tabSettings}
                setTabSettings={setTabSettings}
              />
              <ColorConfig 
                font='タブ文字色' 
                colorType='fontColor' 
                tabSettings={tabSettings}
                setTabSettings={setTabSettings}
              />
              <div
                className={`${styles.clearConfig} ${styles.clearConfigButton}`}
                onClick={() => {
                  setTabSettings({
                    isFollow: false, 
                    backgroundColor: '#66767E', 
                    fontColor: '#ffffff', 
                    spaceField: '', 
                    tabs: [{startRowIndex: 0, tabName: 'タブ１'}]
                  });
                  setEditFormData(null); 
                }}
              >
                設定内容をクリア
              </div>
            </div>
                          <div className={styles.configButtons}>
              <CancelButton onClick={handleCancel} text="キャンセル" />
              <SubmitButton onClick={handleSave} text="保存" />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.groupSettingHeader}>
        グループ設定
      </div>
              <div className={styles.userRawsContainer}>
        {tabSettings?.spaceField !== '' ? (
          <>
            <div className={styles.tableHeaderSticky}>
              <div className={styles.tableHeaderType}>行タイプ</div>
              <div className={styles.tableHeaderRow}>行数</div>
              <div className={styles.tableHeaderFields}>行に所属するフィールド</div>
            </div>
            <UserRawsData 
                editFormData={editFormData} 
                tabSettings={tabSettings}   
                setTabSettings={setTabSettings}
                setEditFormData={setEditFormData}
                recordData={recordData}
            />
          </>
        ) : (
          <div className={styles.noSelectionMessage}>
            タブ開始位置を選択するとフィールドが表示されます
          </div>
      )}
      </div>
      {
        openAlertToast 
        && 
        <Toast 
          message="設定していたスペースIDが見つからなかったためタブ設定をリセットしました。" 
          duration={8000} 
          backgroundColor="#d9534f" 
        />
      }
    </div>
  );
};

export default Config;
