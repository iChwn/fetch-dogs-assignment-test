import { icon_list } from "assets/image"
import { routeUrl } from "constant"
import { useNavigate } from "react-router"
import { removeCookie } from "utility/helper"
import { useFetch } from "utility/hooks/apiHooks/useFetch"
import _ from "lodash"
import { useEffect } from "react"

const SimpleNavbar = () => {
	const {logoutProccess, logoutLoading, logoutCallback} = useFetch()
	const navigate = useNavigate()

	useEffect(() => {
		if(!_.isEmpty(logoutCallback) && logoutCallback.status === 200) {
			removeCookie("auth")
			setTimeout(() => {
				navigate(routeUrl.authentication)
			}, 500);
		}
	}, [logoutCallback])

	return (
		<nav className='fixed top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm'>
			<div className='px-3 py-6 lg:px-5 lg:pl-3'>
				<div className='flex items-center justify-between relative h-[30px]'>
					<div></div>
					<div className='md:left-[0px] left-[-40px] flex items-center justify-start absolute'>
						<img
							src={icon_list.sb_logo_white}
							className='w-[200px] mr-3'
							alt='FlowBite Logo'
						/>
					</div>
					<button
						className="px-4 py-2 bg-red-500 text-white rounded-md disabled:opacity-50"
						onClick={logoutProccess}
						type="button"
					>
						Logout
					</button>
				</div>
			</div>
		</nav>
	)
}

export default SimpleNavbar
