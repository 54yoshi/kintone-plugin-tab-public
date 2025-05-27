//行を他のタブに追加できるようにするためのコンポーネント
//今後拡張予定

// import './TabSelector.css';
// import React, { useState, useEffect } from "react";
// import CancelButton from "./CancelButton";
// import SubmitButton from "./SubmitButton";
// import { TabSettings, EditFormLayout, EditLayoutItem} from '../../../kintoneDataType';
// import { cloneDeep } from 'lodash';


// type Props = {
//   rowData: EditLayoutItem;
//   tabSettings: TabSettings | null;
//   editFormData: EditFormLayout | null;
//   setEditFormData: (editFormData: EditFormLayout) => void;
//   setIsTabSelectorOpen: (isTabSelectorOpen: boolean) => void;
// }

// const TabSelector = ({
//   rowData, 
//   tabSettings, 
//   editFormData, 
//   setEditFormData, 
//   setIsTabSelectorOpen
// }: Props) => {
//   const [copyFormData, setCopyFormData] = useState<EditFormLayout | null>(null);
//   const [rowDataIndex, setRowDataIndex] = useState<number | undefined>(undefined);
  
//   function handleCancel() {
//     setIsTabSelectorOpen(false);
//   }
  
//   function handleSubmit() {
//     setIsTabSelectorOpen(false);
//     setEditFormData(copyFormData as EditFormLayout);
//   }

//   const handleCheckBox = (tabId: number, checked: boolean) => {
//     const index = checkRowIndex();
//     const newCopyFormData = cloneDeep(copyFormData);
//     if(index === undefined){
//       return;
//     }
//     const newCopyFormLayout = newCopyFormData?.layout[index];
//     if(checked){
//       if (newCopyFormLayout) {
//         newCopyFormLayout.memberTabs?.push(tabId);
//         setCopyFormData(newCopyFormData as EditFormLayout);
//       }
//     }else{
//       if (newCopyFormLayout && copyFormData?.layout[index]) {
//         newCopyFormLayout.memberTabs = copyFormData.layout[index].memberTabs.filter((value: number) => value !== tabId);
//         setCopyFormData(newCopyFormData as EditFormLayout);
//       }
//     }
//   };

//   useEffect(() => {
//     if (editFormData) {
//       setCopyFormData(editFormData);
//       setRowDataIndex(checkRowIndex());
//     }
//   },[editFormData]);

//   function checkRowIndex(){

//     const targetCodes = rowData?.type === 'GROUP' ? rowData?.layout.flatMap(field => field.fields.map(field => field.code)) : rowData?.fields.map(field => field.code);

//     const targetIndex = editFormData?.layout.findIndex(item => {
//     if(item.type === 'GROUP'){
//       return targetCodes.every(code =>
//         item.layout.some(field => field.fields.some(field => field.code === code))
//       );
//     }
//       return targetCodes.every(code =>
//         item.fields.some(field => field.code === code)
//       );
//     });
//     return targetIndex;
//   }

//   return (
//     <div 
//       style={{
//         position: 'fixed',
//         top: '0',
//         left: '0',
//         width: '100%',
//         height: '100%',
//         backgroundColor: 'rgba(0, 0, 0, 0.5)',
//         zIndex: '1000',
//       }}
//     >
//       <div 
//         style={{
//           position: 'absolute',
//           top: '50%',
//           left: '50%',
//           transform: 'translate(-50%, -50%)',
//           width: '600px',
//           height: '600px',
//           backgroundColor: 'white',
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'flex-start',
//           justifyContent: 'center',
//         }}
//       >
//         <div 
//           style={{
//             display: 'flex',
//             justifyContent: 'flex-start',
//             alignItems: 'center',
//             width: '100%',
//             height: '80px',
//             padding: '0 32px',
//           }}
//         >
//           <div 
//             style={{
//               fontSize: '24px', 
//               width: '100%',
//               display: 'flex',
//               justifyContent: 'flex-start',
//               alignItems: 'center',
//           }}>
//             所属タブグループ設定
//           </div>
//         </div>
//         <div 
//           style={{
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'flex-start',
//             width: '100%',
//             height: '440px',
//             padding: '32px',
//             backgroundColor: '#F7F9FA',
//             gap: '16px',
//           }}
//         >
//           <div>
//             <div
//               style={{
//                 fontSize: '16px',
//                 width: '100%',
//                 display: 'flex',
//                 justifyContent: 'flex-start',
//                 alignItems: 'center',
//                 paddingBottom: '10px',
//               }}
//             >
//               所属するメインタブグループ
//             </div>
//             <div
//               style={{
//                 width: '100%',
//                 height: '36px',
//                 display: 'flex',
//                 justifyContent: 'flex-start',
//                 alignItems: 'center',
//               }}
//             >
//               <div 
//                 style={{
//                   fontSize: '16px',
//                   width: 'max-content',
//                   display: 'flex',
//                   justifyContent: 'flex-start',
//                   alignItems: 'center',
//                   backgroundColor: '#fff',
//                   border: '1px solid #E6EAEA',
//                   padding: '5px 16px',
//                   marginRight: '10px',
//                 }}
//               >
//                 {tabSettings?.tabs.find(tab => tab.tabId === rowData.id)?.tabName ?? `タブ${rowData.id}`}
//               </div>
//             </div>
//           </div>
//           <div 
//             style={{
//               width: '100%',
//               fontSize: '16px',
//               display: 'flex',
//               justifyContent: 'flex-start',
//               alignItems: 'center',
//             }}
//           >
//             この行を追加で表示させるタブ
//           </div>
//           <div style={{
//             width: '100%',
//             height: '270px',
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'flex-start',
//             backgroundColor: '#fff',
//             overflowX: 'hidden', 
//             overflowY: 'auto',
//             padding: '15px',
//           }}>
//             <div>
//               <ul className="tabCheckboxUl">
//                 {tabSettings?.tabs.map((tab) => (
//                   rowData.id === tab.tabId ? null : (
//                     <li key={`tabGroupMember-${tab.tabId}`}>
//                       <label 
//                         style={{
//                           display: 'flex',
//                           justifyContent: 'flex-start',
//                           alignItems: 'center',
//                           gap: '10px',
//                           paddingBottom: '8px',
//                       }}>
//                         <input 
//                           type="checkbox" 
//                           checked={rowDataIndex !== undefined && copyFormData?.layout[rowDataIndex]?.memberTabs.includes(tab.tabId) || false}
//                           onChange={(e) => {
//                             handleCheckBox(tab.tabId, e.target.checked);
//                           }}
//                         />
//                         {tab.tabName ?? `タブ${tab.tabId}`}
//                       </label>
//                     </li>
//                   )
//                 ))}
//               </ul>
//             </div>
//           </div>
//         </div>
//         <div 
//           style={{
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             width: '100%',
//             height: '80px',
//             padding: '0 32px',
//             gap: '24px',
//           }}
//         >
//           <CancelButton onClick={handleCancel} text="キャンセル" />
//           <SubmitButton onClick={handleSubmit} text="保存"/>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TabSelector;