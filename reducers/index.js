const istate={
	my_data:"",
  callee:""
}

const reducer=(state=istate,action)=>{
  
  switch(action.type)
  {
    case 'MY_DATA':{
     return Object.assign(
     	{}, state, {
     my_data: action.payload,})
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