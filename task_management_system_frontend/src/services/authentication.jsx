import { useState } from "react";
import { useEffect } from "react";
import { FetchAllMembersService } from "./admin/member/MemberService";


export const Authentication = (username, password) => {
  
  return new Promise((resolve, reject) => {
    // Simulate an asynchronous authentication process with a setTimeout.
    if (username === 'yash' && password === 'yash') {
      resolve({ admin: true });
    } else{
      FetchAllMembersService().then((value)=>{
        if(value.success){
            const exists = value.members.find(member => member.username === username && member.password === password);
            console.log(exists);
            if(exists){
              resolve({admin: false,memberId:exists.memberId});
            }else{
              reject(new Error('Authentication failed! Invalid credentials.'));      
            }
        }else{
          reject(new Error('Authentication failed! Invalid credentials.'));
        }
      }).catch((reason)=>{
        reject(new Error('Authentication failed! Invalid credentials.'));
      })
    }
  });
}
