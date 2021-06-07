import axios from 'axios';
const baseUrl =  "https://api.meter.io:8000/api/accounts";
const while_list = [
'0x1c4b70a3968436b9a0a9cf5205c787eb81bb558c',
'0x0d0707963952f2fba59dd06f2b425ace40b492fe',
'0xc1a76f84d977e8d424a8eb09ce6adf029d38b91d',
'0x6f04787447975b40d29611833711117ed9de155f'
];

const getTotalCount = async (address:string) => {
    const res = await axios.get(
       `${baseUrl}/${address}/txs`
      );
      return res.data.totalRows ? res.data.totalRows : 0;
    
}

const getTransactions = async (address:string) => {
    const totalRows = await getTotalCount(address);
    const res = await axios.get(
       `${baseUrl}/${address}/txs?page=${totalRows}&limit=1`
      );
      return res;
    
}





 const isWhiteListVerified = async (address:string) => {
    var hasAccess = false
    const allTransactions = await getTransactions(address);
    if(allTransactions.data.txSummaries.length){
    
        var lastOrigin = allTransactions.data.txSummaries[0].origin
        console.log(lastOrigin)
        
        if(while_list.includes(lastOrigin)){
            hasAccess = true
        }
    }
    return hasAccess

}

export default isWhiteListVerified