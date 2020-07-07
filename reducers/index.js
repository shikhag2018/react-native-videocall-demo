const istate={
	caller:"",
  callee:""
}

const reducer=(state=istate,action)=>{
  
  switch(action.type)
  {
    case 'CALLER':{
     return Object.assign(
     	{}, state, {
     caller: action.payload,})
     }
    
    case 'CALLEE':{
     return Object.assign(
      {}, state, {
     callee: action.payload,})
     }
     
    default:
     return state
    
   }
}
    
export default reducer;