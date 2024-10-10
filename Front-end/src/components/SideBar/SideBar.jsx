import React from 'react';
import { LayoutDashboard, Users, Settings, HelpCircle, Menu, X, LogOut ,ChevronDown,LibraryBig } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link , useNavigate } from 'react-router-dom';
import axios from 'axios'

const menuItems = [
  { id: 1, label: "Dashboard", icon: LayoutDashboard, link: "/Dashboard" },
  { id: 2, label: "Mentors", icon: Users, link: "/Mentors_Formations" },
  { id: 2, label: "Formations", icon: LibraryBig, link: "/Formations" }
  // { id: 3, label: "Settings", icon: Settings, link: "/admin/settings", 
  //   submenu: [
  //     { id: 'general', label: "General", link: "/admin/settings/general" },
  //     { id: 'security', label: "Security", link: "/admin/settings/security" },
  //     { id: 'notifications', label: "Notifications", link: "/admin/settings/notifications" },
  //   ]
  // },
  // { id: 4, label: "Help", icon: HelpCircle, link: "/admin/help" },
];

export default function SideBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const pathname = window.location.pathname;
  const navigate = useNavigate()

  const handleLogout = async() => {
    try {
      await axios.get(`${import.meta.env.VITE_API_LINK}/api/auth/logout`,{withCredentials:true});
      navigate('/'); 
      localStorage.clear();
  } catch (error) {
      console.error('Logout failed:', error);
      alert("Logout failed");
  }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        className={`fixed top-4 left-4 z-50 lg:hidden ${isMobileMenuOpen ? 'hidden' : 'block'}`}
        onClick={() => setIsMobileMenuOpen(true)}
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-background border-r z-50 w-64
          transition-transform duration-300 ease-in-out flex flex-col
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Sidebar Header */}
        <div className={`flex items-center h-16 px-4 border-b ${isMobileMenuOpen ? 'justify-between' : 'justify-center'}`}>
          <Link to="/Dashboard" className={`flex items-center ${isMobileMenuOpen ? 'ml-0' : 'flex-grow justify-center'}`}>
            <img className="h-12 w-18" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAcsAAABuCAMAAAB/esicAAAA+VBMVEX/////eAAAAAD/eQP/ewj/dgD/cgD/cQD/dAD/7Nr/4s3/fAb/uIj/gBH/bwD7+/ve3t7X19c1NTVvb29LS0t9fX309PTLy8uIiIj/s4AeHh6QkJD/18AKCgpFRUV/f3++vr7/izX99Ov/sXb/tYj/jy3/4Mj/r33/2bz/z67q6upfX1/FxcWYmJj/hRwsLCympqZTU1P/zKP/lFFkZGQvLy//ol//wJH/xJ//qW60tLQ8PDwXFxckJCSgoKD/k0H/nFD/nlf/lTr+5Nf/nWD+pXH/kk3/ZAD/1K3/ya3/jEH+upP97ub/hzH/nlL/pV//xo//uX3/iRui0aeEAAAZoUlEQVR4nO1dCUPbONOOY8tWEuJwJoQzmBIIRziWK1AKtNDtbuHtfv3/P+aTZnTazuWENuxmugtYlmRZj2Y0MxrJudyUpjSlKU1pSlOa0pSmNKUpTWlKU5rSlP6VVHgjin73i/0HqeyV3oLIzO9+sf8glcmbUDASltGXs3rn6fJy+2rtpTKuN/33U5k4b0H+CFgWO69h4FNGvh+6X6+n4npAKhPXcT3Hc9h/rjvab0//zi5jC5chNcYXoaF7Pc4X/hdTmXgTxZct4vPynvrB4Awepqw5CE2YjL0KiQkk43j+h781BXMAYliCiERhOejvvkI3I5YcSuRGwudLhqsLl/7rFMz+VOZDf1L4cs9Hie+S0Lm/fHooBVSwqP847hf/FxLKWA/lmcFcrv7tZPidCcuICwleOrxvAR9Wik++mAOCqQLUl1DGcthcB/8by+9MWG77ICTc8IM2KltlCiOMlKdSth9xm2T85NIMWEY+cV02P4ZW2aJDekjtKOZKeDPPQuUd+CwAS1dojvgPOtT456YkmJfJAtnmy2uwRhz6YCe3QhD4pISXhSIQ79pi/XHrWeUrXO0+/fH16Xm39WKUrnxR7uGXq+c//nh6PjNvA0V79eenp2dwSmDtRfv2zPMfX7+mlZwsKgsbYMxWZhYsd7g0ZQpsXJjeY7rfhKvdP0NGzksuegx96n8VmVpbwldE/TB80JPrGmT/81su2qUB3qYd6wmVq3IIJUPnKpdrh5Bf347q4jYrGTw2h3+tX0dvYl96TgYZG4UOV8D8TvxGM4Q6/Q9wVefcS9pRbov/Qf/Asveh+R40bBdE4bWQD9OwVXkNZA7i04KuPdpSRUm4ndsikEPdbrmBUTP9c3vo9/p1pPw+qbI1Lkp7J0hhnI0vv4XYXcmh74LRSXfggmEJmtBlAGMGsWz7jqMaD7UQAdca1Bp8e/Qd0WbH4v2obd4IW/f8WRrLbfRdoOTiP8P7oV/slxHqseMWsVmw/E7Bkesl7zyClemEcFEHNnm98sGCIoBlx5cYcf8CdDoVwnct4G9H7lnlfP2Gl2Wga+Z/8PW7MxBLbYsvZ0K8SyiWZRfB5dBv9qvoLWRsNt96BxAjD8k7f1EwdUNgpjr6a11sN/BlATmahPfPz09tkIkMuC9QFvmSaU8koDs7hKvK/NIVaul1gE2mfJbktizcdwWWQrqTsPTwdO8IYRtOrKVbRq50pYx1zX9u7DKR4KQkZJWxjHVYeT9lQtrjEtTxQpC+dd8V6NAg9IO/WdJ3n6vOpA3aZ6WFwzNsQVmOJS9A22cRo+sSFg6FJC8htuHD2ZeXZl3ZZ4hl5ZUCt5e556ISXZUIDKL2pFq6gi+VkdkTqzToEglORl/BDnf6uH7KqG8KGauxZGOO0EfW/y/cTGCjgF0TOdFe+Z5uwVqIbfKQTXN7FCUlPqYlzCDR2oJL4CWEjAVriEEpNaUmYj2xLigxX46Rsvp9fkJh/6/knQIF7gn3+AXKWCYLW+o+l49B2JaXrRD0YWRwjiVnNNX/X6khNx7AqUSVPrPnA5aCL58ItEg/6BpMXfr30O/2a0j4fTztKogxqNMlwU1PcDLLWCEa07DE6il0ah1XUqjBHGtAX+TlLnh1FZa8ScRVcrED8Pl1uID5UFqunFDNwvkyKsGjjCWaCmFav0c8w6SZJEquRfc1PeIJsUuwTbLwJUiIIAXLIoUhYvIl6bYIVml2QJV1qYGlozlPlEcsi8DBpKyL74FaizL2CxT1d43aHwDqYG3ol/slxLnhDYySDFh+RvdOSsEmhQEn50sOLH1K5Ir2rj/cl5g2KlogsAz4ODMAmQF7ErFshVxpov/TlRQcNqI8xPIsAOPmsb4rqb7FJxB3UidMbZMY7DU6ZbBJULzRH8k7QkMJQbSBr8Dxr+wshZlyyJ14emXdlLEO+aByzhh8iRYJqcf7A7GEnJ5LfU3CzR97+KRQWb67SaP52DOuX9aBYchr8s536FTLVxBjjV3KDEfh1ie4fm1h6ZtY6vkSvfkWNAaWu77sDTDa8LcxTCaOQMY6jjNGXdZzM+mxZ8gkbnIiFNIXF0pQxgYtM8M9mvHMTmE259YPDqbWY/kCuW/zpSv48jvncc8aF1x/cFH32cZlh0TsrxtmDUx7Y5Iy1jQe3VGQxaIZZGyRT16uaQIIQqe7Q9F5VgcsQjPXhxCmfBqWv3auilwkx/TYbliCjHVNNos8zZeoJbmvW3F6nVgsPQlezHuTaf1SDoMsa17oLaVb8fTrAE1WhK8OngATyxdc6KD3YuHyDKxAjaUbk7HgyxG6D7iEDHd5AUxKOV/ytwlaUYImdF1a+X3GImSFQzBbjEiH4krEnp1cccEEJgSFL3ILNbD8HoDBqaK7QFgbNomn1ss4IULIl3voSCBarLd4mIrQY5mWy3NOqKKTQkqPHavzJ1OMSBNVHFKyZ8yO8LOJ9QnE0uRLsYyiDPgPqNF01X20TVIJQc8z/Ib36OBH+xIm8BTrZ1KpLMPvYk6CPr6CLjJX2amZYrfaCAq1Ipth2YnbeSJuow4aiYklLB+72nnA4xA8075MYKnskJ8EoZNlmdCFl0G/D8ZcEMPLc400obEi41/zwp7PgmXRL0F5WlJi9uUxFINDLhsm9dgd7knQHvAilrB8eIn5UvjwxJIXKeFAuRIPE771XR+E95aaHq/CgFHoTOhCCWDpgudNw+G6GR0GriyWLdZZiFOHhDvXzUKhuHbp47IGg0ryAvoKTL6EZRKl/zZLGPFr2iTdZCzMxfxdSbCzO9Mpy3VpgSWOCo++or82msH1b39SV6ONdRItQiWitts1ruCK9UzrviyZDcvKve+iwCcB5eokRUc6U0YUp+L6pYnlLgpK57oQFdYuKcGBKEIH+DqJl5SxVPh6zsRaNIOPP8zhznPpw2NjC7x4DqWv29dXP9ro9iGlCRWxag+Cl6r9xJYvB0jIHu/D6WWLOsLFwm10ZeoGZyoLYmlaoU0I5HBJUG6XOSBYhY/OQFyLphaWrpKxudxlIJ8H+basGJEIZnCGLUMaoAa/e8IAnhRSMtYEUDqrhia55J95n1fh3kdbFxuBA41SDWWarwCUTxfR51M1VoEBP7h+2R3L6NF35BOZIChuwWq0jPd5aftypKuwrwl1rOdMGetJt7SaLGFjV4+4giRbjoxlLuoAA6gZ23XZ5GmG5jEsSQzLqESlTCC01Mr5PNSdeKDPAF8SU8YGDPKSwjJX2aWU18hGgu+0cm34U8XhRZe+pRz6pYnlSr0HIcaFWt6a02FifoytY6qavBH2uK/dUxH1xvqc+n7b3uReh8Bj2x/7cu/zEgwNev+F+28hNBk8u2shd6GaWIYuP0/BWBspdtgQ8H1S7jBVGGWso+/ubVEft0GwUu7jpM6VnGAt2k3I05hiOzBJ9WeU8wpyxesH3rk+m6V26msxh1mhCRQzC/YeGfP57g9YJX5Zwzy8ZNSEPQUaghdIaFqhAZXi2tpekVcZeeDTLFnNqf9kTWED7PP1hAYUCNL2peUlkMAMN28q2TwalpyiQrE43CFBUWEMbtICsKAIqzbT38OJRV33k3jmn4P52HXBTD68SaCWb9gz742S+6JdFYA1fISeJ1XCkfny1xDxOLkPKqENQzst6OgdkDyvwIrDQzhdhc6AYhY4Ev98J1iCzkSIjHyWjqdwsufFbmTGx2ouNPkRTI1BfOwGou8FyxYsjzENtbP35UvxaivA3SOJJdT3QbiXNjY94g/XMBkHIrnF3cl4XsFvoDY0m+nAPFoaTEnXiIB/ZwQ2iUTPExOevDa02r6QylXo7HEFv4OaDsbeGkY2eUerzzYl1rzSQEPZ2lOPNRgb3NHvBMtcEz3mYsLgEoVMrpOuDxn7Lz2NnOTMpBOhO+kFlnckY/lKFuV+cyC+P357kj07valsIunFuEv8NpP7AopZ3w+WjJrfH3+WCCn9fPi+1z/35FI5gYbkyphxmR5/5yZFLBScngX8G6hMpFlorCQrX4GXwpOpG8AkA8vc74ov/y2Ex5YJc0JDZEPlKk2vC+l5Nfte2lwlRmlZZoH2B6oP885m8NJ2b4BVf+1kdXN19WZudvgnvAmVNUshCnJ5JO5Vd1PWM13NoxiX4OKsmw3L5dsNixZPD5YPbdjm8vn19fX87SD4VO8g73qGnl7ABvQqWb05/ZgXtH56NNjoemMquxZHxWAUU6HtBkrFUlWQ3b5cyKfQ3abZTXOYOD8QliuYOQOWG1hyrnuOm/lYO5erwz9m3KR9eLEVLjcO7gDrmXKmzRa7lYolo086ywhY7p8vMDr/1LsQ0mIfLCspTT2uDVJzP5odopUJwngfM4bSkz6QhCHSdT0TMVTSOWOMSDcs8wsqywhYzsbr6kF9sKxupDZzHGDWhmhlgtLOW9fBNjJmyc6TsEmMouIii9+nK5b5c5lldCyXBmlJbywrt12aOQYwR8RS81vMULQMTB2JlipcvZgPd6x8mc8f2a96NxCW+TfC0mznvDlv3o0+Z46MZYw8w8JMCTdIrmfqYGlFI2B5eoN0crS0rrpJAFJtAA3GAIeYWXTw2LBsqEYtQIbqicJzc6B29aLRsFTh5mo5RP4vZSzaG6a+69q+dRtryJnF77OQ6JDqieq2TC9n0riwrErkPjZU0lJsyGWn0bAEnNBsNDBT8cYKQLA8u61netK+lD9G4Eurtw8H6aX92dnZvuKtC5bV/RTnQy8sb2SLTOFwKtJWkw3r4dio7Cdud8Oy0qeqKu8BY4+7+kMukmiHUIwnbR+e1F9d+d8Yscwti17CGXN2aZPRktll+58O7vjExQXePt6+wddf3gTiHXB4WBMsflA7PDxUPXCzcAsW/93pUs0YDb2wvLUaJEgMlPydkTa3eQra18fTTaOixjIQa9Ts8iJ/9sXBjXxy7bD2Ces5Za3UY6XaWNiAqi4OPhlwbkJNDV7wnAmLRmwvre2KU98jkWxnTJBGjIiWrrAFhIcKZ4rDS8VS9tIi9g9eHGvd55OeU4/kqF7GHljXHJ23SZa1EuePFJo9sBQtyK/Y6tdBXHzMnZp1n6qqVmXVJ/ruBsJW/Zi3SBa5uTBTN1UrVXehiOdYgmUh3K7K55NiRMrl2jRCcey1y21+XlnG+NhULGUvfZw1elLbJJbuuzpnYWnYJGlYVg9iqfl5Oeh7YClF7FF6smSmo3jdJ+KGwHL2xLoLkqJqYZZfxwIVa1AwupPjBS83BZSaLxMKjFr2iKOXSNRq7/11YfehGZaiv8n4sFw1eymOZcyMEQJ5MCzP492dz9+KantgmWBAQVUk0bDNZN0n5ut8tKHMr+93wzKWaDy7Il5WqhQNI97HSduLgEyHa19d1jM10fK3Px9+dGa+fSUj6LExLKUJcJKCZaxHJA2E5U2iGKObvljeGVV0pdW0umvdb2GTq3d2GuRP80tcoJjFiwU5yRjzpWIvFcjlJlwDXWMMkJFJ+1v4v4d/zv4ZJ1/uG28bw7KqX2/e7IcklktLS6L22032N78t/XDnRycnR1KOneIze2BpZ0ynmmzI6eqnI2WvrFRjWJ6vbir5yZWmyvLSkmD7edbKTSv7wtGnIzUpwAtUYgg3pG/dpUEYBvjhSUp8Qnw4NIfSMAjg9FZCWSI/ydpH1YffoYQGPp5rHwb88udV+Hlnt/N/48RSAnaexFK+6MVhtVKt6ikqiWUuYZNIHUbotFINwqvuWMqR1dMrIBBawbqV9Xlktjm/BNAq2MWzYjaJfNwBzuRzcgDCO5lA3m7cNcSaFwk6Z829qye+QZw+bm+/luvFV0IJS22edVzikvunmbJ/eVY82wXA/a2ZvbOO83h1xaP26eVZs9C6JJQrPmCIjh9L4AQbS3Fnvmr1w2BY3sQwuRsMS6lWHyVvKZLtUMWXjHZKLKWLWYr6Q6usxFLkXpS6a/VWN1vz5UENp2rAkrZFdO+eR+CsJL45bce/F8frFl8p/SuX28ZM15SfJgm9ufeFn+JBXBHxtKcdgr8CS9lnyhCTzDUIlqv5j4x02QGxlOx8krylaMlsBbRkXjdUYqnsRHHdwCsbS7kgo03NmjEsJJTK2ubdT0p8/0QEn0CiRJ57tcNTX67OKvxEANy7GsHGtS0Cp469tGDXxQ7le5SjszN2q0Xl/Dl+LA/4hYWlgG5R5x0Cy30MIJElJXvg1WhYbsTQstAVWG6oe+s9sBRtNibnyrxqmuTLeXWT6bEubPjulMp88/C2D1gWmPCkX5vXbFrs8FOLYE/5Bzf8yX798P01jm8IsfqMfSFDwM87f6RCexo/lvB6FpYiv7Fuez44lrp3KvsNrVVgWn8Z22OxeBZN/lsjcEno21yuCiy15+q2B5YN+T66LvHSXCQnhhXjS8KPH7sOCeFf3mgCls0/mf7DPxoRhJ9n+HkaHEuehWetB/yrDp+pA4fI7/BS16Hvh9/4JwgEY47PJpHTP7y9haXoBcMvejIkltWb1QPbEMD0/rrPavKWJMm66wZhChctqxZ0ud5Yiswfk1WdaL7Uli7Hkh8/xs/iANEJWJ7hl5NKYlN31OafJ2iFHuEHitVD/oGXUMjmHY5hrhLluPhtBmOfL7UpnLOxrNwlevxmKCznEo6f/lhKZuix3FJL1ipoozoklkvp9YhXFH9qPzKTsQTYizp4prLGEkRv1CwqvgwcgSU/eEpjaeyKKoQiWOQX+H0qOETNOLuGftH+WEqvfSYsj7u/xhix7L46v6n5Uj9Z8iVgyfcdEokl3+gdbdPwWWLZCk0sAxfPoNvh+a9wg3HZI+Pmy4pgnjtQJSwscV5az8iX1pg/PTweEEtxKx+LbKge1uBftReW82PFUg4r3QiOJWev3cBzQsaIBcmX8Jmkekj8ZyljNV9yWfxAHZ/L2p3wjMPMD14J4WQe8NKPDUupbKAulyZjjflyCCxVdMDtwtEhs80GxVJ6JBp2svQmzio4Fjc3l9g/+LGEtJpRxh4kq+LOxhQsPZcbHEwTDbde+LFUCkt29RT6/DTyqB38hacgA5YB58di2YcPaO0A/34O/fCh+eCMHUvppUbj3NJ9hHvFMA8sy643lqIL5+fEdDMolpLrDuxkUeJO5+jiGRoKSzFwbtKrSsFSfLglWluL4Fs5Usby38XLbe4vkPOlwNKH3abRFzglZYfyk12jqzo3RB/HLWOlUigQsbAUE5421YawLyW7K4fKyoBYVkRGO+hONpMDOIs5NtLjy4bC0pr/E5SKpUMfxOE10YPvSCzlQcpRYr70CUF/QpHPl5R8VkfpEiLd7OPBclawi3R5WVhKuabCBKTcHADLQ933ZsX9sVSCwgy6U2uMHGAZcmkGdOj9KUNhKdq8WEmtKgVL+IRAm38WMDrjR/kF36KXf7id6D/uRdHes9ssNssB6rEOKUZRhzrE3y1WohboPswOLZ+BQdLBs+NGjHU2hFNDrbSLbrWwlLbesYy0k6s/A2ApYFfyWY4LvOqF5b58yq0GS+ooG+aVMSZxf8otl5VDYVm9jefeX8SqjIU8/RjhQiVhWCrBd3E8J5DfUSLsL6bPsB8uTwwwX8i0JT+ET2rzA3r50bss1S0z1UevgI6A5UFDxlTqmInY6obwrUv7cIV3UkUvZvbCMl16yXiSAbDUtsy6GAlq9UJICDmlqoEi9SVe32BYytl40yhptoxrxCk2iYqFJXakbPqyNO7V9HZbxRmG5nfx8ZB46fHuJ5FLf7k4lt20/15YHs9BWemBwJs15fyxeiwdS3OlnymrRgiHXN2QdssB2sQygAFU8cGwvMNWKtGTX4K2NGQ8J2iCSSyNU0NiAHrmL8/43wFPewHOF7wKYvHsuFg9Xix1RJSFZVqYRz8sxevvS57fbDQ+GWv3lf5Yan0sRvPVZIaV41i89mBYcoIYEb0ou368ov4GvSrVV6DQlEfHitAPV0ZVCmbUQdCkLPf1y+8tiyhLV+7vGyuWWmWMYVm9tTOKGgbAstvD9gfAUgftWrSiHVCpsStoWfTB0giVACwracNVuLr0ywjCfV465lWGNMswds/4qVmYOA/XzeLe9hYljgyJ1eetj+bDi9Op4aSLx27tL5o5l+2Yytj+S8P7mjMUJSQZyoEzXr89e7WVfIIuzGiuFDCt2K2uWOa0yMbYrZTtgR+xXWl8STzjs2PWN8jwCr9O5sq7Mjd++DxRStwe2z6vDWulUGB5oZT0yrLGZDXmjxViVPbxnAYA8DDBPJEuo3nI3Q/L3H6CXRbswPm5mMQ4loZTPyy1+BAxlbmTWNjsotSfE1iWFIoOHo0srlwFE6aZd2OfnRM/XDMhyIDl5vG8Rbcb50dztsU9d8FvXJwaqbNHi/MrH+82lmeVDw99RNUNrEbxy/7y/Lrx+rMKj4M5WfP8HSxmnWPJHvuic7UDYyysnyZ2K1VuDDQvVhXSR3fwGGUT507hwXcN1cqFC7OV0O5jXdWGcgJVPh4D6WcW34iynHjU/+yJLuX297GvbiSXdaPZWu2wVpMYzd0sLJ4unMyZTx+8tbON5cWLu5XjjaVG+maXuZPz+ePj24OjmlFr4t2SL1uxW8moWjs6uD2+uF24MYeXCMkdvMXvioSU7uK/nNLk0n6NDV72vx6ZQg6N5eSAKf1KkvFWCf/KhH6eckrdSdliYpuUhPKgT7kpTSApRfR2YXn5QCl7h/1LTmnSyHTlaBp9O/yUfgOl7dU6mM6W75Maid2JXdbgpzT5VDmxnGWbk3Jk5JQy0X7jZnXpfGnz5OY/DuT/A3PoNYe8YI+NAAAAAElFTkSuQmCC" alt="Logo" />
          </Link>

          {/* Mobile Close Button */}
          <Button
            variant="ghost"
            className={`lg:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>


        {/* Sidebar Content */}
        <nav className="flex-1 overflow-y-auto">
          <ul className="p-2 space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                {item.submenu ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button 
                        className={`w-full flex items-center p-3 rounded-lg hover:bg-muted transition-colors
                          ${pathname.startsWith(item.link) ? 'bg-muted' : ''}`}
                      >
                        <item.icon className="h-6 w-6 flex-shrink-0 text-orange-500" />
                        <span className="ml-3 flex-grow text-left">{item.label}</span>
                        <ChevronDown className='text-orange-500' />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48">
                      {item.submenu.map((subItem) => (
                        <DropdownMenuItem key={subItem.id}>
                          <Link to={subItem.link} className="w-full">
                            {subItem.label}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link
                    to={item.link}
                    className={`flex items-center p-3  hover:bg-muted transition-colors
                      ${pathname === item.link ? 'bg-muted border-r-4 border-orange-500' : ''}`}
                  >
                    <item.icon className="h-6 w-6 flex-shrink-0 text-orange-500" />
                    <span className="ml-3">{item.label}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Sidebar Footer with Logout */}
        <div className="border-t flex flex-col items-center">
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full p-4 text-left hover:bg-muted transition-colors"
          >
            <LogOut className="h-6 w-6 flex-shrink-0 text-orange-500" />
            <span className="ml-3 font-medium">Logout</span>
          </button>
          
          {/* Copyright */}
          <div className="p-4">
            <p className="text-sm text-muted-foreground text-center">© 2024 ODC Agadir</p>
          </div>
        </div>

      </aside>
    </>
  );
}