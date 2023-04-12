import { render, screen, cleanup } from '@testing-library/react';
import Login from "../Components/Login/Login"
import CustomerDashboard from '../Components/Dashboard/CustomerDashboard/CustomerDashboard';
import GroundteamDashboard from '../Components/Dashboard/GroundteamDashboard/GroundteamDashboard';
import SalesDashboard from '../Components/Dashboard/SalesDashboard/SalesDashboard';
import ManagerDashboard from '../Components/Dashboard/ManagerDashboard/ManagerDashboard';


afterEach(()=>{
  cleanup();
})

test('CustomerDashboard Page render', () => {
  render(<CustomerDashboard/>)
  const CustomerDashboardElement = screen.getByTestId("CustomerDashboard-1")
  expect(CustomerDashboardElement).toBeInTheDocument()
});

test('Login Page render', () => {
    render(<Login/>)
    const LoginElement = screen.getByTestId("Login-1")
    expect(LoginElement).toBeInTheDocument()
  });

 

  test('GroundTeamDashBoard Page render', () => {
    render(<GroundteamDashboard/>)
    const GroundTeamDashBoardElement = screen.getByTestId("GroundTeamDashBoard-1")
    expect(GroundTeamDashBoardElement).toBeInTheDocument()
  });

  test('SalesDashboard Page render', () => {
    render(<SalesDashboard/>)
    const SalesDashboardElement = screen.getByTestId("SalesDashboard-1")
    expect(SalesDashboardElement).toBeInTheDocument()
  });

  test('ManagerDashboard Page render', () => {
    render(<ManagerDashboard/>)
    const ManagerDashboardElement = screen.getByTestId("ManagerDashboard-1")
    expect(ManagerDashboardElement).toBeInTheDocument()
  });



 