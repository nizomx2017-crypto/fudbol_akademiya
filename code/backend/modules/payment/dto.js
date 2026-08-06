module.exports={create:{amount:{required:true,type:"number"}},webhook:{reference:{required:true,type:"string"},status:{required:true,oneOf:["paid","failed","cancelled"]}}};
