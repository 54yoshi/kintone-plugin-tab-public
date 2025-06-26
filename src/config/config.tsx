import './Config.css';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { isEqual, cloneDeep } from 'lodash';
import { KintoneRecord, FormLayout, EditFormLayout, TabSettings } from '../kintoneDataType';
import { findSpaceField } from './utils/handleRecords';
import Toast from './Component/parts/Toast';
import UserRawsData from './Component/UserRawsData';
import DropDown from './Component/parts/DropDown';
import ColorConfig from './Component/parts/ColorConfig';
import CancelButton from './Component/parts/CancelButton';
import SubmitButton from './Component/parts/SubmitButton';
import Alert from './Component/parts/alert';

const PLUGIN_ID = kintone.$PLUGIN_ID;
const appId = kintone.app.getId();
const baseUrl = location.origin;

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
    const raw = kintone.plugin.app.getConfig(PLUGIN_ID);
    const body = { app: appId };
  
    const initialTabSettings = raw.tabSettings
      ? JSON.parse(raw.tabSettings)
      : tabSettings;
  
    const initialEditFormData = raw.editFormData
      ? JSON.parse(raw.editFormData) 
      : null;
  
    setTabSettings(initialTabSettings);
    setEditFormData(initialEditFormData);
  
    initialConfigRef.current = {
      tabSettings: cloneDeep(initialTabSettings),
      editFormData: cloneDeep(initialEditFormData),
    };

    const fetchFormLayout = kintone.api(
      kintone.api.url('/k/v1/preview/app/form/layout.json', true),
      'GET',
      body
    );
  
    const fetchRecordData = kintone.api(
      kintone.api.url('/k/v1/preview/app/form/fields.json', true),
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

  const handleUnload = useCallback((e: BeforeUnloadEvent) => {
    if(!isClean){
      e.preventDefault();
    }
  }, [isClean]);

  useEffect(() => {
    const newConfigData = {
      tabSettings: tabSettings, 
      editFormData: editFormData
    }
    setIsClean(isEqual(newConfigData, initialConfigRef.current));
  }, [tabSettings, editFormData]);

  function getLowerSpaceIndex(form: FormLayout, spaceId: string){
    const targetIndex = form.layout.findIndex(field => field.type === "ROW" && field.fields.some((field) => field?.elementId === spaceId));
    return targetIndex;
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
      const pluginListUrl = `${baseUrl}/k/admin/app/${appId}/plugin/`;
      if (window.top) {
        window.top.location.href = pluginListUrl;
      } else {
        window.location.href = pluginListUrl;
      }
    }
  };

  return (
    <div className="config">
      {isAlertOpen && (
        <Alert 
          setIsAlertOpen={setIsAlertOpen}
          handleUnload={handleUnload}
          setIsClean={setIsClean}
        />
      )}
      <div className='configHeader'>
        <div 
          className='configHeaderContents'
        >
          <DropDown 
            font='タブ開始位置' 
            fetchFormData={formData}
            fetchRecordData={recordData}
            setEditFormData={setEditFormData}
            tabSettings={tabSettings}
            setTabSettings={setTabSettings}
          />
          <div className='headerConfigContainer'>
            <div style={{
              display: 'flex',
              gap: '13px',
            }}>
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
                className='clearConfig'
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '7px 24px',
                  whiteSpace: 'nowrap',
                }}
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
            <div className='configButtons'>
              <CancelButton onClick={handleCancel} text="キャンセル" />
              <SubmitButton onClick={handleSave} text="保存" />
            </div>
          </div>
        </div>
      </div>
      <div style={{
        width: '100%',
        height: '60px',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        fontSize: '15px',
        marginTop: '10px',
      }}>
        グループ設定
      </div>
      <div className="userRawsContainer">
        {tabSettings?.spaceField !== '' ? (
          <>
            <div style={{
              position: 'sticky',
              top: '0',
              width: '100%',
              height: '55px',
              display: 'flex',
              gap: '48px',
              alignItems: 'center',
              padding: '0 32px',
              borderBottom: '1px solid #E6EAEA',
              backgroundColor: '#F7F9FB',
              zIndex: '10',
            }}>
              <div style={{
                width: '130px',
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}>行タイプ</div>
              <div style={{
                width: '50px',
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}>行数</div>
              <div style={{
                minWidth: '300px',
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}>行に所属するフィールド</div>
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
          <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
          }}>
            タブ開始位置を選択するとフィールドが表示されます
          </div>
      )}
      </div>
      {
        openAlertToast 
        && 
        <Toast message="設定していたスペースIDが見つからなかったためタブ設定をリセットしました。" duration={8000} backgroundColor="#d9534f" />
      }
    </div>
  );
};

export default Config;
