import React, { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { routeUrl } from "constant";
import { SimpleTemplate } from "components";
import ProtectedRoute from "utility/auth/ProtectedRoute";
import AuthenticationRoute from "utility/auth/AuthenticationRoute";
import DogList from "page/dog-list";

const AuthPage = React.lazy(() => import("page/authentication"))

const Router = () => {
  return (
    <Suspense fallback={<div className="w-full h-full flex items-center justify-center">Loading... </div>}>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route element={<SimpleTemplate />}>
            <Route path="/*" element={<Navigate to={routeUrl.dogList} replace />} />
            <Route path={routeUrl.dogList} element={<DogList/>} />
          </Route>
        </Route>
        
        <Route element={<AuthenticationRoute />} >
          <Route path={routeUrl.authentication} element={<AuthPage/>} />
        </Route>
      </Routes>
    </Suspense>
  )
}
 
export default Router