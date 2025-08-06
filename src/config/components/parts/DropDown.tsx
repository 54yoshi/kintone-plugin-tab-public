import React ,{ useState, useEffect, useRef } from 'react';
import styles from './DropDown.module.css';
import CheckIcon from '@mui/icons-material/Check';
import { 
  EditFormLayout, 
  FormLayout, 
  KintoneRecord, 
  TabSettings, 
  LayoutItem 
} from '../../../kintoneDataType';
import { getLowerSpaceIndex } from '../../utils/handleRecords';

type InsertPositionSelectProps = {
  value?: string;
  font?: string;
  fetchFormData?: FormLayout | null;
  fetchRecordData?: KintoneRecord | null;
  setEditFormData: (editFormData: EditFormLayout | null) => void;
  tabSettings: TabSettings;
  setTabSettings: (tabSettings: TabSettings) => void;
};

const DropDown: React.FC<InsertPositionSelectProps> = ({
  font,
  fetchFormData,
  setEditFormData,
  tabSettings,
  setTabSettings,
}) => {
  const [spaceId, setSpaceId] = useState<string | null>(tabSettings?.spaceField || null);
  
  console.log('DropDown初期化:', {
    'tabSettings.spaceField': tabSettings?.spaceField,
    'spaceId': tabSettings?.spaceField || null
  });
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (!dropdownRef.current || dropdownRef.current.contains(event.target as Node)) {
        return;
      }
      setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if(tabSettings.spaceField === ""){
      setSpaceId(null);
    }
  }, [tabSettings.spaceField]);

  useEffect(() => {
    if(spaceId === null || !fetchFormData){
      return;
    }
    const spaceIndex = getLowerSpaceIndex(fetchFormData, spaceId);
    
    if(spaceIndex === -1)return;

    // editFormDataを更新
    const lowerLayout: LayoutItem[] = fetchFormData.layout.slice(spaceIndex + 1);
    const newFormData: FormLayout = {
      layout: lowerLayout,
      revision: fetchFormData.revision
    };

    if (newFormData !== undefined && setEditFormData) {
      setEditFormData(newFormData);
    }

    // tabSettingsを一度だけ更新
    if(tabSettings){
      setTabSettings({
        ...tabSettings,
        spaceField: spaceId, 
        tabs: [{startRowIndex: 0, tabName: 'タブ１'}]
      });
    }
  }, [spaceId]);

    //スペースフィールドがあるかどうかを確認するための関数
    function searchSpaceField(fetchFormData: FormLayout){
      return fetchFormData?.layout.some((layoutItem) => {
        switch(layoutItem.type){
          case "GROUP":
          return layoutItem.layout.some((groupRow) => groupRow.fields.some((field) => field.type === "SPACER" && field.elementId !== ''));
          default:
          return layoutItem.fields.some((field) => field.type === "SPACER" && field.elementId !== '');
        }
      })
    }

  return (
    <div 
      className={styles.insertPosition}
      ref={dropdownRef}
    >
      <div>
        <span className={styles.insertPositionLabel}>{font}</span>
        <span className={styles.requiredAsterisk}>
          *
        </span>
      </div>
      <div 
        className={styles.insertPositionDropdown}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        {tabSettings?.spaceField !== '' ? tabSettings?.spaceField : 'スペースフィールドID'}
        {isOpen ? (
          <div className={styles.selectList} >
            {!searchSpaceField(fetchFormData as FormLayout) ? (
              <div className={styles.noSpaceMessage}>
                スペースが見つかりません
              </div>
            ) 
            : 
            (
              fetchFormData?.layout.map((layoutItem) => {
                if (layoutItem.type === "GROUP") {
                  return layoutItem.layout.map((groupRow) => {
                    return groupRow.fields.map((field, index) =>
                      field.type !== "SPACER" || field.elementId === '' ? null : (
                        <div
                          className={field.elementId === tabSettings?.spaceField ? `${styles.selectedSpaceIdItem} ${styles.dropdownItem}` : `${styles.spaceIdItem} ${styles.dropdownItem}`}
                          key={`スペース-${index}`} 
                          onClick={() => {
                            setSpaceId(field.elementId as string);
                            setIsOpen(false);
                          }}
                        >
                          {field.elementId === tabSettings?.spaceField ? <CheckIcon className={styles.checkIconStyled} /> : null}
                          {field.elementId}
                        </div>
                      )
                    );
                  });
                } else {
                  return layoutItem.fields.map((field, index) =>
                    field.type !== "SPACER" || field.elementId === '' ? null : (
                      <div 
                        className={field.elementId === tabSettings?.spaceField ? `${styles.selectedSpaceIdItem} ${styles.dropdownItemGroup}` : `${styles.spaceIdItem} ${styles.dropdownItemGroup}`}
                        key={`スペース-${index}`}
                        onClick={() => {
                          setSpaceId(field.elementId as string);
                          setIsOpen(false);
                        }} 
                      >
                        {field.elementId === tabSettings?.spaceField ? 
                        <CheckIcon className={styles.checkIconStyled} /> 
                        : null}
                        {field.elementId || 'スペース'}
                      </div>
                    )
                  );
                }
              })
            )}
          </div>) : null
        }
      </div>
    </div>
  );
};

export default DropDown;



