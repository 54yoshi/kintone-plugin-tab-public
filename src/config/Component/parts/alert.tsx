import React from 'react';
import SubmitButton from './SubmitButton';
import CancelButton from './CancelButton';

type Props = {
  setIsAlertOpen: (isAlertOpen: boolean) => void;
  setIsClean: (isClean: boolean) => void;
  handleUnload: (e: BeforeUnloadEvent) => void;
}

const Alert: React.FC<Props> = ({ 
  setIsAlertOpen, 
  setIsClean,
  handleUnload,
}) => {

  function handleCancel(){
    setIsClean(false);
    setIsAlertOpen(false);
  }

  function handleDelete(){
    setIsClean(true);
    window.removeEventListener('beforeunload', handleUnload);
    const appId = kintone.app.getId();
    const baseUrl = location.origin;
    const pluginListUrl = `${baseUrl}/k/admin/app/${appId}/plugin/`;
    if (window.top) {
      window.top.location.href = pluginListUrl;
    } else {
      window.location.href = pluginListUrl;
    }
  }

  return(
    <div
      style={{
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: '1000',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '360px',
          backgroundColor: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
        }}
      >
        <div 
          style={{
            fontSize: '24px', 
            width: '100%',
            height: '80px',
            padding: '0 32px',
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}
        >
          注意
        </div>
        <div 
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '200px',
            padding: '32px',
            backgroundColor: '#F7F9FA',
            gap: '16px',
          }}>
          変更内容が保存されていません。<br/>
          ページを離れると変更が破棄されます。<br/>
          よろしいですか？
        </div>
        <div 
          style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: '80px',
              padding: '0 32px',
              gap: '24px',
        }}>
          <CancelButton 
            onClick={handleCancel}
            text='キャンセル'
          />
          <SubmitButton 
            onClick={handleDelete}
            text='破棄する'
            color='red'
            borderColor='#E6EAEA'
          />
        </div>
      </div>
    </div>
  )
};

export default Alert;