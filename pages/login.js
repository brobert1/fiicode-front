import { GoogleLogin } from "@components";
import { LoginForm, SignupForm } from "@components/Forms";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";

const Page = () => {
  return (
    <main className="cover flex min-h-screen flex-col items-center justify-center px-4 py-8">
      <div className="my-8 flex w-full max-w-xl flex-col rounded-lg bg-white px-4 py-6 lg:px-8">
        <Tab.Container defaultActiveKey="login">
          <Nav variant="pills" fill className="grid w-full grid-cols-2">
            <Nav.Item>
              <Nav.Link eventKey="login">
                <div className="flex items-center justify-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full text-xl lg:h-10 lg:w-10 lg:text-2xl">
                    <p>🗝️</p>
                  </span>
                  <p className="text-base font-semibold lg:text-lg">Login</p>
                </div>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="signup">
                <div className="flex items-center justify-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full text-lg lg:h-10 lg:w-10 lg:text-xl">
                    <p className="mb-1">🏫</p>
                  </span>
                  <p className="text-base font-semibold lg:text-lg">Signup</p>
                </div>
              </Nav.Link>
            </Nav.Item>
          </Nav>
          <Tab.Content>
            <Tab.Pane eventKey="login" className="py-8">
              <LoginForm />
            </Tab.Pane>
            <Tab.Pane eventKey="signup" className="py-8">
              <SignupForm />
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
        <GoogleLogin />
      </div>
    </main>
  );
};

export default Page;
