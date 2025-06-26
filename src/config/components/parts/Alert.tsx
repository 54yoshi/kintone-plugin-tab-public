import React from 'react';
import styles from './Alert.module.css';
import SubmitButton from './SubmitButton';
import CancelButton from './CancelButton';
import { KINTONE_UI_URLS } from '../../constants/endpoint';

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
    const pluginListUrl = `${baseUrl}${KINTONE_UI_URLS.ADMIN_APP_PLUGINS}/${appId}${KINTONE_UI_URLS.PLUGIN_LIST_PATH}`;
    if (window.top) {
      window.top.location.href = pluginListUrl;
    } else {
      window.location.href = pluginListUrl;
    }
  }

  return(
    <div className={styles.alertOverlay}>
      <div className={styles.alertModal}>
        <div className={styles.alertHeader}>
          注意
        </div>
        <div className={styles.alertContent}>
          変更内容が保存されていません。<br/>
          ページを離れると変更が破棄されます。<br/>
          よろしいですか？
        </div>
        <div className={styles.alertButtons}>
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