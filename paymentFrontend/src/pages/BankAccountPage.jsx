import { useEffect, useState } from "react";
import axios from "../config";
import { listofbanks } from "../bankData"
export function BankAccountPage() {
    console.log("listofbanks ", listofbanks);
    const [banks, setBanks] = useState([]);
    // axios.defaults.baseURL = 'http://localhost:3000/api/v1/';
    const [currentPrimaryBankId, setCurrentPrimaryBankId] = useState("");
    const token = localStorage.getItem('token')
    const [unlinkedBanks, setUnlinkedBanks] = useState([]);

    const fetchData = async () => {
        try {
            const response = await axios.get("user/getAllBanksOf1User",
                {
                    data: {},
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
            console.log("response is, ", response.data);
            setBanks(response.data.list4);
            setCurrentPrimaryBankId(response.data.currentPrimaryBankId);
        } catch (error) {
            console.log(error)
            console.log("error fetching banks");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const newUnlinkedBanks = listofbanks.filter(x => !banks.some(bank => bank.bankId === x.bankId));
        setUnlinkedBanks(newUnlinkedBanks);
    }, [listofbanks, banks]);

    // useEffect(()=>{
    //             console.log(" before fetching curr primary  ", banks );

    //             async function name() {
    //                 const response = await axios.get("user/getCurrPrimary", {
    //                     headers: {
    //                         "Authorization": `Bearer ${token}`
    //                     }}
    //                  );
    //                  setCurrentPrimaryBankId(response.data.currentPrimaryBankId)
    //                  console.log(response.data);  
    //              }
    //              name();
    // }, [banks])


    useEffect(() => {
        (async () => {
            const response = await axios.get("user/getCurrPrimary", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
            );
            setCurrentPrimaryBankId(response.data.currentPrimaryBankId)
            console.log(response.data);
        })();
    }, [banks])

    async function removeBank(bankIdx) {
        try {
            const response = await axios.delete("user/removeAccount",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    data: {
                        bankId: bankIdx
                    }
                }
            );
            console.log("bank account removed", response.data);
            setBanks((prev) => prev.filter(bank => bank.bankId !== bankIdx));
        }
        catch (error) {
            console.log(error);
        }
    }
    //   function handleAddBankAccount(bankId, bankname){

    //   }
    async function handleAddBankAccount(bankId, bankname) {
        try {
            const response = await axios.put(
                "user/addBankAccount",
                { bankId },
                {
                    headers: { "Authorization": `Bearer ${token}` }
                }
            );
            console.log(response.data);
            setBanks(prev => [...prev, { bankId, bankname }]);
        } catch (error) {
            console.log(error);
        }
    }

  async function handleMakePrimary(bankId) {
            try {
                const response = await axios.put(
                    "user/makePrimaryBank",
                    { bankId },
                    {
                        headers: { "Authorization": `Bearer ${token}` }
                    }
                );
                console.log(response.data);
                setCurrentPrimaryBankId(bankId);

            } catch (error) {
                
            }
    }

    return (
        <div>

                

            <div style={{ fontWeight: 'bold',  marginBottom: '1em' }}>Below is the list of linked bank accounts: </div>
                
            <>
                {banks.map((x) =>
                (
                    <div key={x.bankId}>
                        --{x.bankname}-- {x.bankId === currentPrimaryBankId ?  <span style={{ fontWeight: 'bold'}} > Primary-- </span>  :

                            <button onClick={()=>handleMakePrimary(x.bankId)}>  make primary </button>
                        }
                        <button onClick={() => removeBank(x.bankId)} >  Remove Bank </button>

                    </div>
                )
                )}
            </>

            <br></br>
            <br></br>        <br></br>
            <div>  <div  style={{ fontWeight: 'bold' }}>  Below is the list of unlinked bank accounts: </div>

                <br></br>        <br></br>
                {unlinkedBanks.map(x => (
                    <div key={x.bankId}>
                        {x.bankname} ---
                        <button onClick={() => handleAddBankAccount(x.bankId, x.bankname)}>Add Bank Account</button>
                    </div>
                ))}
            </div>

        </div>
    );
}