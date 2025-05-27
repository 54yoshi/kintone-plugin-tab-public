import React ,{ useState, useEffect, useRef } from 'react';
import './DropDown.css';
import CheckIcon from '@mui/icons-material/Check';
import { 
  EditFormLayout, FormLayout, KintoneRecord, TabSettings, LayoutItem } from '../../../kintoneDataType';

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
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  function getLowerSpaceIndex(form: FormLayout, spaceId: string){
    const targetIndex = form.layout.findIndex(field => field.type === "ROW" && field.fields.some((field) => field?.elementId === spaceId));
    return targetIndex;
  }

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
    if(spaceId === null){
      return;
    }
    const spaceIndex = getLowerSpaceIndex(fetchFormData as FormLayout, spaceId);
    
    if(spaceIndex === null || !fetchFormData){
      return;
    }

    if (setEditFormData) {
      setEditFormData(null);
    }
    setTabSettings({
      isFollow: false, 
      backgroundColor: '#66767E', 
      fontColor: '#ffffff', 
      spaceField: '', 
      tabs: [{startRowIndex: 0, tabName: 'タブ１'}]
    });

    const lowerLayout: LayoutItem[] = fetchFormData.layout.slice(spaceIndex + 1);
    const newFormData: FormLayout = {
      layout: lowerLayout,
      revision: fetchFormData.revision
    };

    if ( newFormData!== undefined && setEditFormData) {
      setEditFormData(newFormData);
    }

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
      className="insert-position"
      ref={dropdownRef}
    >
      <div>
        <span className="insert-position__label">{font}</span>
        <span style={{
          color: 'red',
          padding: '0 4px',
        }}>
          *
        </span>
      </div>
      <div 
        className={`insert-position__dropdown`}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        {tabSettings?.spaceField !== '' ? tabSettings?.spaceField : 'スペースフィールドID'}
        {isOpen ? (
          <div className="selectList" >
            {!searchSpaceField(fetchFormData as FormLayout) ? (
              <div 
                style={{
                  height: '30px',
                  padding: '5px 20px',
                }}
              >
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
                          className={field.elementId === tabSettings?.spaceField ? "selectedSpaceIdItem" : "spaceIdItem"}
                          style={{
                            display: 'flex',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '13px',
                            padding: '5px 20px',
                            cursor: 'pointer',
                          }}
                          key={`スペース-${index}`} 
                          onClick={() => {
                            setSpaceId(field.elementId as string);
                            setIsOpen(false);
                          }}
                        >
                          {field.elementId === tabSettings?.spaceField ? <CheckIcon style={{fontSize: '13px'}} /> : null}
                          {field.elementId}
                        </div>
                      )
                    );
                  });
                } else {
                  return layoutItem.fields.map((field, index) =>
                    field.type !== "SPACER" || field.elementId === '' ? null : (
                      <div 
                        className={field.elementId === tabSettings?.spaceField ? "selectedSpaceIdItem" : "spaceIdItem"}
                        style={{
                          display: 'flex',
                          justifyContent: 'flex-start',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '13px',
                          cursor: 'pointer',
                        }}
                        key={`スペース-${index}`}
                        onClick={() => {
                          setSpaceId(field.elementId as string);
                          setIsOpen(false);
                        }} 
                      >
                        {field.elementId === tabSettings?.spaceField ? <CheckIcon style={{fontSize: '13px'}} /> : null}
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



