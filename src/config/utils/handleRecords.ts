import { FormLayout, EditFormLayout, KintoneRecord, SubtableFieldProperty, TabSettings } from "../../kintoneDataType";

  //スペースフィールドがあるかどうかを確認するための関数
  export function findSpaceField(fetchFormData: FormLayout, tabSettings: TabSettings){
    return fetchFormData?.layout.some((layoutItem) => {
      switch(layoutItem.type){
        case "GROUP":
        return layoutItem.layout.some((groupRow) => groupRow.fields.some((field) => field.type === "SPACER" && field.elementId !== '' && field.elementId === tabSettings?.spaceField));
        default:
        return layoutItem.fields.some((field) => field.type === "SPACER" && field.elementId !== '' && field.elementId === tabSettings?.spaceField);
      }
    })
  }

  export function createNewData(form: FormLayout, record: KintoneRecord){
    const formNewData = {...form};
    const recordNewData = {...record};
    
    formNewData.layout = formNewData.layout.map((object) => (
      {
        ...object,
        id: 1,
        memberTabs: [],
      }  
    ))
    formNewData.layout.forEach((data, index) => {
      switch(data.type){
        case 'ROW': {
          data.fields = data.fields.map((field, rowIndex) => (
          field.code && recordNewData.properties[field.code] ?
          {
            type: field.type,
            code: field.code,
            fieldName : recordNewData.properties[field.code].label,
          }
        :
          {
            type: field.type,
            code: `${field.type}${index}${rowIndex}`,
            fieldName : field.type === 'SPACER' ? 'スペース' :
                        field.type === 'LABEL' ? 'ラベル' :
                        field.type === 'HR' ? '罫' : ''
          }
        ))
        break;
      }
      case 'SUBTABLE': {
        const tableFiledCode = data.code;
        const subtableProp = recordNewData.properties[tableFiledCode] as SubtableFieldProperty;
       data.fields =data.fields.map((field, rowIndex) => (
          field.code && subtableProp.fields[field.code] ?
          {
            type: field.type,
            code: field.code,
            fieldName : subtableProp.fields[field.code].label,
          }
        :
          {
            type: field.type,
            code: `${field.type}${index}${rowIndex}`,
            fieldName : field.type === 'SPACER' ? 'スペース' :
                        field.type === 'LABEL' ? 'ラベル' :
                        field.type === 'HR' ? '罫' : ''
          }
        ))
        break;
      }
      case 'GROUP': {
        data.layout.forEach((row, groupIndex) => (
          row.fields =row.fields.map((field) => (
            field.code && recordNewData.properties[field.code] ?
            {
              type: field.type,
              code: field.code,
              fieldName : recordNewData.properties[field.code].label
            }
          :
            {
              type: field.type,
              code: `${field.type}${index}${groupIndex}`,
              fieldName : field.type === 'SPACER' ? 'スペース' :
                        field.type === 'LABEL' ? 'ラベル' :
                        field.type === 'HR' ? '罫' : ''
            }
          ))
        ))
        break;
      }
    }
    })
    return formNewData as EditFormLayout;
  }
