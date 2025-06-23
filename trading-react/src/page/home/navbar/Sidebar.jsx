import React from "react";
import { HomeIcon, LayoutDashboardIcon } from 'lucide-react';
import {
    Home,
    LayoutDashboard,
    Bookmark,
    Activity,
    Wallet,
    Landmark,
    CreditCard,
    User,
    LogOut
  } from "lucide-react";
import { Button } from "../../../components/ui/button";
import {SheetClose} from "../../../components/ui/sheet";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../../state/Auth/Action";

const menu=[
    {name:"Home", path:"/", icon:<Home className='h-6 w-6'/>},
    {name: "Portfolio",path: "/portfolio",icon: <LayoutDashboard className="h-6 w-6"/>},
    {name: "Watchlist", path:"/watchlist",icon:<Bookmark className="h-6 w-6"/>},
    {name:"Activity", path:"/activity", icon:<Activity className='h-6 w-6'/>},
    {name:"Wallet", path:"/wallet", icon:<Wallet className='h-6 w-6'/>},
    {name:"Payment Details", path:"/payment-details", icon:<Landmark className='h-6 w-6'/>},
    {name:"Withdrawal", path:"/withdrawal", icon:<CreditCard className='h-6 w-6'/>},
    {name:"Profile", path:"/profile", icon:<User className='h-6 w-6'/>},
    {name:"Logout", path:"/logout", icon:<LogOut className='h-6 w-6'/>},
]
const Sidebar= () => {
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const handleLogout=()=>{
        dispatch(logout())
    }
    return (
        <div className='mt-3 space-y-2'>

            {menu.map((item) =>(
                <div key={item.name}>
                    <SheetClose asChild className="w-full">
                        <Button className="flex items-center gap-5 py-6 w-full"
                        onClick={()=> {navigate(item.path)
                            if(item.name=="Logout"){
                                handleLogout()
                            }
                        }}
                        >
                        <span className="w-8">{item.icon}</span>
                        <p>{item.name}</p>
                        </Button>
                    </SheetClose>
                </div>
            ))}

        </div>
    );
}

export default Sidebar