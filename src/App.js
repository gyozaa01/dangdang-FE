import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import './login.css';
import './sign.css';
import './sign_form.css';
import './login_form.css';
import './searchid_form.css';
import './searchpw_form.css';
import './modal.css';
import './logouthomepage.css';
import './brand.css';
import './loginhomepage.css';
import './star.css';
import './community.css';
import './post.css';
import './comment.css';
import SocialKakao from './kakaologin';
import { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';

function Navbar({ isLoggedIn, name, onLogout }) {
    return (
        <div className="nav">
            <div className="nav_logo">
                <img src="당당이.png" alt="로고" className="logo_img" />
                <Link to="/logouthomepage" style={{ fontWeight: "bold" }}>당당</Link>
            </div>
            <ul className="nav_menu">
                <li><Link to="/loginhomepage" className="home">홈</Link></li>
                <li><Link to="/mypage" className="mypage">마이페이지</Link></li>
                <li><Link to="/communitypage" className="community">커뮤니티</Link></li>
            </ul>
            <ul className="nav_login">
                {isLoggedIn ? (
                    <>
                        <li><span>{name}님</span></li>
                        <li><a href="#">|</a></li>
                        <li><a href="#" onClick={onLogout}>로그아웃</a></li>
                    </>
                ) : (
                    <>
                        <li><Link to="/login">로그인</Link></li>
                        <li><a href="#">|</a></li>
                        <li><Link to="/sign">회원가입</Link></li>
                    </>
                )}
            </ul>
        </div>
    );
}

function Logo({ message }) {
    return (
        <div className="logo">
            <div className="center_logo">
                <img src="당당이.png" alt="로고" className="logo_img" />
                <div className="logo_ment" style={{ fontWeight: "bold" }}>당당</div>
            </div>
            <div className="logo_message">
                <div>{message}</div>
                <div>오늘도 당당하게</div>
            </div>
        </div>
    );
}

function SignUp() {
    return (
        <div className="login_sign">
            <div className="kakao_sign">
                <SocialKakao />
            </div>
            <div className="email_sign">
                <div className="email_ment"><Link to="/signformpage">이메일로 가입하기</Link></div>
            </div>
        </div>
    );
}

function Question() {
    // 현재 페이지의 경로를 가져옴
    const location = useLocation();

    // 현재 경로가 '/login'인지 여부를 확인하여 문구를 설정
    const questionText = location.pathname === '/login' ? '아직 계정이 없으신가요?' : '이미 계정이 있으신가요?';
    const buttonText = location.pathname === '/login' ? '회원가입' : '로그인';
    const buttonLink = location.pathname === '/login' ? '/sign' : '/login';

    return (
        <div className="question">
            <div className="question_ment">{questionText}</div>
            <Link to={buttonLink} className="question_login">{buttonText}</Link>
        </div>
    );
}


function SignUpPage() {
    return (
        <div>
            <Logo message="회원가입하고" />
            <SignUp />
            <Question />
        </div>
    );
}

function LoginPage({ onLogin }) {
    const [errorMessage, setErrorMessage] = useState(''); // 오류 메시지 상태
    const [showModal, setShowModal] = useState(false); // 모달 표시 여부 상태

    // 모달 닫기 함수
    const closeModal = () => {
        setShowModal(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const params = {
                loginId: e.target.email.value,
                password: e.target.password.value,
            };
            console.log(params);
            const response = await axios.post('http://localhost:8080/login', {}, { params });
    
            console.log(response);
            if (response.status === 200) {
                // 로그인 성공
                onLogin(e.target.email.value); // 사용자 이름을 전달
                window.location.href = '/homepage'; // 로그인 후 이동할 페이지
            } else {
                // 로그인 실패
                setErrorMessage(response.data.message);
                setShowModal(true);
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('로그인 중 오류가 발생했습니다.');
            setShowModal(true);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <div className="logo">
                    <div className="center_logo">
                        <img src="당당이.png" alt="로고" className="logo_img" />
                        <div className="logo_ment">당당</div>
                    </div>

                    <div className="logo_message">
                        <div>로그인하고</div>
                        <div>오늘도 당당하게</div>
                    </div>
                </div>

                <div className="login_sign">
                    <input type="email" className="id" name="email" placeholder="&emsp; 이메일 주소" />
                    <input type="password" className="pw" name="password" placeholder="&emsp; 비밀번호" />
                </div>

                <div className="login_button_container">
                    <button type="submit" className="login_button">로그인</button>
                </div>
                
                <div className="id_pw">
                    <ul>
                        <li><Link to="/searchidpage">아이디 찾기</Link></li>
                        <li><a href="#">|</a></li>
                        <li><Link to="/searchpwform">비밀번호 재설정</Link></li>
                    </ul>
                </div>
            </div>

            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <div className="error_message">{errorMessage}</div>
                    </div>
                </div>
            )}
        </form>
    );
}

function NotFoundPage() {
    return <div>404 Not Found</div>;
}

function SignFormPage() {
    const [isSignUpSuccess, setIsSignUpSuccess] = useState(false); // 회원가입 성공 여부 상태
    const [showModal, setShowModal] = useState(false); // 모달 표시 여부 상태
    const [errorMessage, setErrorMessage] = useState(''); // 회원가입 실패 시 오류 메시지 상태

    const closeModal = () => {
        setShowModal(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const joinData = {
                loginId: e.target.email.value,
                email: e.target.email.value,
                password: e.target.password.value,
                passwordCheck: e.target.password.value,
                name: e.target.name.value,
                gender: e.target.gender.value,
                phoneNumber: e.target.phonenumber.value
            };
  
            const response = await axios.post('http://localhost:8080/join', joinData);

            console.log(response.data); // 회원가입 성공 메시지 출력

            // 회원가입 성공 시
            setIsSignUpSuccess(true);

        } catch (error) {
            // 에러 처리
            if (error.response) {
                console.error('Error response:', error.response.data);
                setErrorMessage(error.response.data.message); // 서버에서 반환된 오류 메시지 설정
            } else if (error.request) {
                console.error('No response received:', error.request);
                setErrorMessage('서버로부터 응답이 없습니다.');
            } else {
                console.error('Error setting up the request:', error.message);
                setErrorMessage('요청 설정 중 오류가 발생했습니다.');
            }

            // 회원가입 실패 시 모달 표시
            setShowModal(true);
        }
    };

    return (
        <div>
            <div className="sign">회원가입</div>
            <div className="form_box">
                <div className="message">
                    <div className="input_message">입력사항</div>
                    <div className="important_message">(필수)</div>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form">
                        <input type="email" className="email" name="email" placeholder="이메일 주소" />
                        <input type="password" className="password" name="password" placeholder="비밀번호(8자~12자, 영문+숫자)" />
                        <input type="text" className="name" name="name" placeholder="이름" />
                        <input type="tel" className="phonenumber" name="phonenumber" placeholder="핸드폰번호(-없이 입력해주세요)" />
                        <select name="gender" className="gender">
                            <option value="MALE">남자</option>
                            <option value="FEMALE">여자</option>
                        </select>
                    </div>
                    <button type="submit" className="sign_button">회원가입</button>
                </form>
            </div>

            {/* 회원가입 실패 모달 */}
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <div className="error_message">{errorMessage}</div>
                        <div className="retry_message">다시 시도해주세요.</div>
                    </div>
                </div>
            )}

            {/* 회원가입 성공 모달 */}
            {isSignUpSuccess && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setIsSignUpSuccess(false)}>&times;</span>
                        <div className="success_message">회원가입을 성공하였습니다.</div>
                        {/* 로그인하러 가기 버튼 추가 */}
                        <button className="modal_login_button" onClick={() => window.location.href = '/loginformpage'}>로그인하러 가기</button>
                    </div>
                </div>
            )}
        </div>
    );
}

function LoginFormPage() {
    const [errorMessage, setErrorMessage] = useState(''); // 오류 메시지 상태
    const [showModal, setShowModal] = useState(false); // 모달 표시 여부 상태

    // 모달 닫기 함수
    const closeModal = () => {
        setShowModal(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const params = {
                loginId: e.target.email.value,
                password: e.target.password.value,
            };
            console.log(params);
            const response = await axios.post('http://localhost:8080/login', {}, { params });
    
            console.log(response);
            if (response.status === 200) {
                // 로그인 성공
                window.location.href = ''; // 로그인 후 이동할 페이지
            } else {
                // 로그인 실패
                setErrorMessage(response.data.message);
                setShowModal(true);
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('로그인 중 오류가 발생했습니다.');
            setShowModal(true);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <div className="logo">
                    <div className="center_logo">
                        <img src="당당이.png" alt="로고" className="logo_img" />
                        <div className="logo_ment">당당</div>
                    </div>

                    <div className="logo_message">
                        <div>로그인하고</div>
                        <div>오늘도 당당하게</div>
                    </div>
                </div>

                <div className="login_sign">
                    <input type="email" className="id" name="email" placeholder="&emsp; 이메일 주소" />
                    <input type="password" className="pw" name="password" placeholder="&emsp; 비밀번호" />
                </div>

                <div className="login_button_container">
                    <button type="submit" className="login_button">로그인</button>
                </div>
                
                <div className="id_pw">
                    <ul>
                        <li><Link to="/searchidpage">아이디 찾기</Link></li>
                        <li><a href="#">|</a></li>
                        <li><Link to="/searchpwform">비밀번호 재설정</Link></li>
                    </ul>
                </div>
            </div>

            {/* 모달 표시 */}
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <div className="error_message">{errorMessage}</div>
                    </div>
                </div>
            )}
        </form>
    );
}

function SearchIDPage() {
    const [phoneNumber, setPhoneNumber] = useState(''); // 핸드폰 번호를 위한 상태
    const [name, setName] = useState(''); // 이름을 위한 상태
    const [foundId, setFoundId] = useState(''); // 찾은 아이디를 위한 상태

    // 아이디 찾기 함수
    const handleSearchId = async () => {
        try {
            // API를 호출하여 아이디를 찾음
            const response = await axios.post('http://localhost:8080/findId', { phoneNumber, name });
            const foundId = response.data.id; // 찾은 아이디

            // 찾은 아이디를 상태에 저장
            setFoundId(foundId);
        } catch (error) {
            console.error('Error searching for ID:', error);
        }
    };

    return (
        <div>
            <div className="sign">아이디 찾기</div>

            <div className="form_box">
                <div className="form">
                    <input
                        type="tel"
                        className="telnum"
                        placeholder="핸드폰번호(-없이 입력해주세요)"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                    <input
                        type="text"
                        className="name"
                        placeholder="이름"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <button type="button" className="searchid_button" onClick={handleSearchId}>
                    아이디 찾기
                </button>

                <button type = "button" className="login_button">
                    <Link to="/loginformpage">로그인하기</Link>
                </button>

            </div>

            {/* 아이디가 찾아진 경우에만 표시 */}
            {foundId && <SearchIdForm userId={foundId} />}
        </div>
    );
}

// SearchIdForm에서 아이디를 받아와서 표시
function SearchIdForm({ userId }) {
    return (
        <div>
            <div className="search">아이디 찾기</div>

            <div className="form_box">
                <div className="box">홍길동님의 아이디는 <span className="userid">{userId}</span>입니다.</div>

                {/* 로그인 또는 비밀번호 재설정 페이지로 이동할 수 있는 버튼 추가 */}
                <button type="button" className="login_button">
                    <Link to="/loginformpage">로그인하기</Link>
                </button>
                <button type="button" className="pw_re_button">
                    <Link to="/searchpwform">비밀번호 재설정</Link>
                </button>
            </div>
        </div>
    );
}

function Modal({ children, onClose }) {
    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                {children}
            </div>
        </div>
    );
}

function SearchPwForm() {
    const [passwordReset, setPasswordReset] = useState(false); // 비밀번호 재설정 여부를 나타내는 상태
    const [showModal, setShowModal] = useState(false); // 모달 표시 여부를 나타내는 상태

    const handlePasswordReset = () => {
        // 비밀번호 재설정 로직을 수행한 후에 호출되는 함수
        // 여기서는 단순히 setPasswordReset(true)를 호출하여 재설정되었음을 표시
        setPasswordReset(true);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <div>
            <div className="sign">비밀번호 재설정</div>

            <div className="form_box">
                <div className="form">
                    <input type="text" className="form_id" placeholder="아이디" />
                    <input type="password" className="pwd" placeholder="비밀번호(8자~12자, 영문+숫자)" />
                    <input type="password" className="pwdchk" placeholder="비밀번호 재입력" />
                </div>
                <button type="submit" className="sign_button1" onClick={handlePasswordReset}>
                    비밀번호 재설정
                </button>
                <button type="submit" className="sign_button2">
                    <Link to="/loginformpage">로그인하기</Link>
                </button>
            </div>

            {showModal && (
                <Modal onClose={handleCloseModal}>
                    <div>비밀번호가 재설정되었습니다.</div>
                </Modal>
            )}
        </div>
    );
}

function KakaoLoginPage() {
    return (
        <div>
            {/* 카카오 로그인 페이지 내용 */}
            <SocialKakao />
        </div>
    );
}

function LogoutHomePage() {
    return (
      <div className="App">
        <div className="container">
          <div className="hello_box">
            <div className="date">3월 25일 목표!</div>
            <img src="당당이.png" alt="로고" className="hello_logo" />
            <div className="hello_user">
              <div className="hello_dang">0g</div>
              <div className="hello_ment">로그인 후 이용가능합니다.</div>
            </div>
  
            <div className="hello_inbox">
              <div className="hello_inbox_dang">
                <div className="inbox_dang_ment">당 섭취량</div>
                <a href="#" className="inbox_dang">0g</a>
              </div>
  
              <div className="inbox_line"><a href="#">|</a></div>
  
              <div className="hello_inbox_caf">
                <div className="inbox_caf_ment">카페인 섭취량</div>
                <a href="#" className="inbox_caf">0mg</a>
              </div>
            </div>
            <button onClick={() => { window.location.href = '/login' }} className="login_sign_btn">로그인 | 회원가입</button>
          </div>
          <RecommendedMenu />
        </div>
  
        <div className="bbrand">
          <div className="bbrand_ment_plus">
            <div className="bbrand_ment">당당의 인기 프랜차이즈</div>
            <Link to="/brandpage" className="bbrand_plus">더보기</Link>
          </div>
  
          <div className="bbrand_top5">
            <a href="#"><img src="스타벅스로고.png" alt="스타벅스 로고" /></a>
            <a href="#"><img src="메가로고.png" alt="메가 로고" /></a>
            <a href="#"><img src="컴포즈로고.png" alt="컴포즈 로고" /></a>
            <a href="#"><img src="빽다방로고.png" alt="빽다방 로고" /></a>
            <a href="#"><img src="이디야로고.png" alt="이디야 로고" /></a>
          </div>
        </div>
      </div>
    );
  }
  
  function RecommendedMenu() {
    return (
      <div className="recommend">
        <div className="first_line"></div>
        <div className="recommend_name">추천메뉴</div>
  
        <div className="menu_pair">
          <MenuCard
            imageSrc="아이스카푸치노.png"
            brand="스타벅스"
            name="아이스 카푸치노"
            sugar="9g"
            caffeine="118mg"
          />
          <MenuCard
            imageSrc="아이스얼그레이티.png"
            brand="스타벅스"
            name="아이스 얼 그레이 티"
            sugar="0g"
            caffeine="0mg"
          />
        </div>
  
        <div className="menu_pair">
          <MenuCard
            imageSrc="우롱티.png"
            brand="공차"
            name="우롱티"
            sugar="0g"
            caffeine="5mg"
          />
          <MenuCard
            imageSrc="페퍼민트.png"
            brand="컴포즈"
            name="페퍼민트"
            sugar="0g"
            caffeine="0.7mg"
          />
        </div>
  
        <div className="last_line"></div>
      </div>
    );
  }

  function MenuCard(props) {
    return (
      <div className="menu_card">
        <div className="menu_image_wrapper">
          <img src={props.imageSrc} alt={props.name} className="menu_image" />
        </div>
        <div className="menu_info">
          <div className="menu_brand">{props.brand}</div>
          <div className="menu_name">{props.name}</div>
          <div className="menu_detail">
            <span>당: {props.sugar}</span>
            <span>|</span>
            <span>카페인: {props.caffeine}</span>
          </div>
        </div>
      </div>
    );
  }

  function BrandPage() {
    return (
      <div>
        <div className="brand_ment">당당의 인기 프랜차이즈</div>
  
        <div className="brand">
          <a href="#"><img src="스타벅스로고.png" alt="스타벅스 로고" /></a>
          <a href="#"><img src="메가로고.png" alt="메가 로고" /></a>
          <a href="#"><img src="컴포즈로고.png" alt="컴포즈 로고" /></a>
          <a href="#"><img src="빽다방로고.png" alt="빽다방 로고" /></a>
          <a href="#"><img src="이디야로고.png" alt="이디야 로고" /></a>
          <a href="#"><img src="투썸로고.png" alt="투썸 로고" /></a>
          <a href="#"><img src="엔젤로고.png" alt="엔젤리너스 로고" /></a>
          <a href="#"><img src="공차로고.png" alt="공차 로고" /></a>
          <a href="#"><img src="청자로고.png" alt="청자다방 로고" /></a>
          <a href="#"><img src="벌크로고.png" alt="벌크 로고" /></a>
        </div>
      </div>
    );
  }

function LoginHomePage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="App">
          <div className="container">
            <div className="hello_box">
              <div className="date">3월 25일 목표!</div>
                <img src="당당이.png" alt="로고" className="hello_logo" />
                <div className="hello_user">
                  <div className="hello_dang">25g</div>
                  <div className="hello_ment">더 마실 수 있어요!</div>
                </div>
    
                <div className="hello_inbox">
                  <div className="hello_inbox_dang">
                    <div className="inbox_dang_ment">당 섭취량</div>
                    <a href="#" className="inbox_dang">0g</a>
                  </div>
                
                  <div className="inbox_line"><a href="#">|</a></div>
                
                  <div className="hello_inbox_caf">
                    <div className="inbox_caf_ment">카페인 섭취량</div>
                    <a href="#" className="inbox_caf">53mg</a>
                  </div>
                </div>
                <button onClick={openModal} className="goal_button">목표설정하기</button>
              </div>
              <StarToday />
            </div>

            {isModalOpen && (
                <div className="modal">
                <div className="modal-content">
                    <span className="close" onClick={closeModal}>&times;</span>
                    <div className="modal_goal_ment">목표설정하기</div>
                    
                    <div className="input_goal">
                        <div className="input_dang">
                            <input type="text" className="input_dang_ment" />
                            <div className="input_dang_g">g</div>
                        </div>
                        <div className="input_caf">
                            <input type="text" className="input_caf_ment" />
                            <div className="input_caf_mg">mg</div>
                        </div>
                    </div>

                    <div className="eat_ment">※일일 권장 당류, 카페인 섭취량</div>

                    <div className="dang_men_women">
                        <div className="men">
                            <div className="men_ment">남성</div>
                            <div className="men_dang">37g</div>
                        </div>
            
                        <div className="dang_men_women_line"><a href="#">|</a></div>
            
                        <div className="women">
                            <div className="women_ment">여성</div>
                            <div className="women_dang">25g</div>
                        </div>
                    </div>

                    <div className="caf_men_women">
                        400mg
                    </div>

                    <div className="modal_buttons">
                        <button type = "submit" className="ok_modal_button">확인</button>
                    </div>
                </div>
                </div>
            )}

            <div className="Brand">
              <div className="Brand_ment_plus">
                <div className="Brand_ment">당당의 인기 프랜차이즈</div>
                  <Link to="/brandpage" className="Brand_plus">더보기</Link>
                </div>
    
                <div className="Brand_top5">
                  <a href="#"><img src="스타벅스로고.png" alt="스타벅스 로고" /></a>
                  <a href="#"><img src="메가로고.png" alt="메가 로고" /></a>
                  <a href="#"><img src="컴포즈로고.png" alt="컴포즈 로고" /></a>
                  <a href="#"><img src="빽다방로고.png" alt="빽다방 로고" /></a>
                  <a href="#"><img src="이디야로고.png" alt="이디야 로고" /></a>
                </div>
              </div>
            </div>
      );
}

function StarToday() {
    return (
      <div className="star_today">
        <div className="first_line"></div>
        <div className="star_name_plus">
          <div className="star_name">즐겨찾기</div>
          <Link to="/starpage" className="star_plus">더보기</Link>
        </div>
  
        <div className="star_container">
          <div className="star">
            <MenuCard
              imageSrc="아이스카푸치노.png"
              brand="스타벅스"
              name="아이스 카푸치노"
              sugar="9g"
              caffeine="127mg"
            />
          </div>
          <div className="star_right">
            <FontAwesomeIcon icon={faHeart} style={{color: "#ff0000", fontSize: '40px',}} />
            <button className="star_click">담기</button>
          </div>
        </div>
  
        <div className="middle_line"></div>
        <div className="today_name_plus">
          <div className="today_name">오늘 마신 음료</div>
          <Link to="/todaypage" className="today_plus">더보기</Link>
        </div>
  
        <div className="today_container">
          <div className="today">
            <MenuCard
              imageSrc="아이스얼그레이티.png"
              brand="스타벅스"
              name="아이스 얼 그레이 티"
              sugar="0g"
              caffeine="53mg"
            />
          </div>
          <div className="today_right">
              <FontAwesomeIcon icon={faHeart} style={{color: "#ff0000", fontSize: '40px',}} />
              <button className="today_click">삭제</button>
          </div>
        </div>
  
        <div className="last_line"></div>
      </div>
    );
  }

function StarPage() {
    return (
        <div>
            <div className="title">즐겨찾기</div>

            <div className="star_menu">
                <div className="first_menu">
                    <img src="아이스카푸치노.png" alt="아이스카푸치노" className="first_image" />

                    <div className="first_content">
                        <div className="first_brand_menu">
                            <a href="#" className="first_brand">스타벅스</a>
                            <a href="#" className="first_name">아이스 카푸치노</a>
                        </div>

                        <div className="first_detail">
                            <a href="#">9g</a>
                            <a href="#">|</a>
                            <a href="#">118kcal</a>
                        </div>
                    </div>

                    <div className="menu_right">
                        <FontAwesomeIcon icon={faHeart} style={{ color: '#ff0000', fontSize: '40px' }} />
                        <div className="click">담기</div>
                    </div>
                </div>

                <div className="line"></div>

                <div className="first_menu">
                    <img src="아이스카푸치노.png" alt="아이스카푸치노" className="first_image" />

                    <div className="first_content">
                        <div className="first_brand_menu">
                            <a href="#" className="first_brand">스타벅스</a>
                            <a href="#" className="first_name">아이스 카푸치노</a>
                        </div>

                        <div className="first_detail">
                            <a href="#">9g</a>
                            <a href="#">|</a>
                            <a href="#">118kcal</a>
                        </div>
                    </div>

                    <div className="menu_right">
                        <FontAwesomeIcon icon={faHeart} style={{ color: '#ff0000', fontSize: '40px' }} />
                        <div className="click">담기</div>
                    </div>
                </div>

                <div className="line"></div>
            </div>
        </div>
    );

}

function TodayPage() {
    return (
        <div>
            <div className="title">오늘 마신 음료</div>

            <div className="star_menu">
                <div className="first_menu">
                    <img src="아이스카푸치노.png" alt="아이스카푸치노" className="first_image" />

                    <div className="first_content">
                        <div className="first_brand_menu">
                            <a href="#" className="first_brand">스타벅스</a>
                            <a href="#" className="first_name">아이스 카푸치노</a>
                        </div>

                        <div className="first_detail">
                            <a href="#">9g</a>
                            <a href="#">|</a>
                            <a href="#">118kcal</a>
                        </div>
                    </div>

                    <div className="menu_right">
                        <FontAwesomeIcon icon={faHeart} style={{ color: '#ff0000', fontSize: '40px' }} />
                        <div className="click">삭제</div>
                    </div>
                </div>

                <div className="line"></div>

                <div className="first_menu">
                    <img src="아이스카푸치노.png" alt="아이스카푸치노" className="first_image" />

                    <div className="first_content">
                        <div className="first_brand_menu">
                            <a href="#" className="first_brand">스타벅스</a>
                            <a href="#" className="first_name">아이스 카푸치노</a>
                        </div>

                        <div className="first_detail">
                            <a href="#">9g</a>
                            <a href="#">|</a>
                            <a href="#">118kcal</a>
                        </div>
                    </div>

                    <div className="menu_right">
                        <FontAwesomeIcon icon={faHeart} style={{ color: '#ff0000', fontSize: '40px' }} />
                        <div className="click">삭제</div>
                    </div>
                </div>

                <div className="line"></div>
            </div>
        </div>
    );
}

function CommunityPage() {
    return (
        <div>
            <div className="community_all">
                <div className="community_top">오늘도 당당하게</div>

                <div className="community_mid">
                    <div className="mid_first">
                    <Link to="/postpage">글쓰기</Link>
                </div>

                    <div className="mid_second">
                        <select name="post_sort" className="post_sort">
                            <option value="제목/내용" selected>제목/내용</option>
                            <option value="작성자">작성자</option>
                        </select>

                        <input type="text" className="community_searchtext" placeholder=" 검색어를 입력해주세요" />

                        <input type="button" className="community_searchbtn" value="검색" />
                    </div>

                    <ul className="mid_third">
                        <li className="recent_list"><a href="">최신순</a></li>
                        <li> | </li>
                        <li className="recommend_list"><a href="">추천순</a></li>
                    </ul>
                </div>

                <div className="community_bottom">
                    <div className="board_list_wrap">
                        <div className="board_list">
                            <div className="top">
                                <div className="num">번호</div>
                                <div className="c_title">제목</div>
                                <div className="writer">작성자</div>
                                <div className="count">조회</div>
                                <div className="reco">추천</div>
                            </div>
                            <div>
                                <div className="num">5</div>
                                <div className="c_title"><Link to = "/commentpage">글 제목이 들어갑니다.</Link></div>
                                <div className="writer">오영현</div>
                                <div className="count">33</div>
                                <div className="reco">10</div>
                            </div>
                            <div>
                                <div className="num">4</div>
                                <div className="c_title"><a href="#">글 제목이 들어갑니다.</a></div>
                                <div className="writer">오영현</div>
                                <div className="count">33</div>
                                <div className="reco">10</div>
                            </div>
                            <div>
                                <div className="num">3</div>
                                <div className="c_title"><a href="#">글 제목이 들어갑니다.</a></div>
                                <div className="writer">오영현</div>
                                <div className="count">33</div>
                                <div className="reco">10</div>
                            </div>
                            <div>
                                <div className="num">2</div>
                                <div className="c_title"><a href="#">글 제목이 들어갑니다.</a></div>
                                <div className="writer">오영현</div>
                                <div className="count">33</div>
                                <div className="reco">10</div>
                            </div>
                            <div>
                                <div className="num">1</div>
                                <div className="c_title"><a href="#">글 제목이 들어갑니다.</a></div>
                                <div className="writer">오영현</div>
                                <div className="count">33</div>
                                <div className="reco">10</div>
                            </div>
                        </div>
                        <div className="board_page">
                            <a href="#" className="bt first">{'<<'}</a>
                            <a href="#" className="bt prev">{'<'}</a>
                            <a href="#" className="num on">1</a>
                            <a href="#" className="num">2</a>
                            <a href="#" className="num">3</a>
                            <a href="#" className="num">4</a>
                            <a href="#" className="num">5</a>
                            <a href="#" className="bt next">{'>'}</a>
                            <a href="#" className="bt last">{'>>'}</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function PostPage() {
    const [title, setTitle] = useState('');
    const [selectedCafe, setSelectedCafe] = useState('선택');
  
    const handleTitleChange = (event) => {
      setTitle(event.target.value);
    };
  
    const handleCafeSelect = (event) => {
      setSelectedCafe(event.target.value);
      setTitle(`[${event.target.value}] `);
    };
  
    return (
      <div>
        <div className="dangdang_ment">오늘도 당당하게</div>

        <div className="p_title">
          <div className="title_row">
            <div className="title_name">제목</div>
  
            <select className="cafe_select" onChange={handleCafeSelect} value={selectedCafe}>
              <option value="선택">카페선택</option>
              <option value="스타벅스">스타벅스</option>
              <option value="메가커피">메가커피</option>
              <option value="컴포즈커피">컴포즈커피</option>
              <option value="빽다방">빽다방</option>
              <option value="이디야">이디야</option>
              <option value="투썸플레이스">투썸플레이스</option>
              <option value="엔젤리너스">엔젤리너스</option>
              <option value="공차">공차</option>
              <option value="청자다방">청자다방</option>
              <option value="벌크커피">벌크커피</option>
              <option value="자유">자유</option>
            </select>
          </div>
  
          <input
            type="text"
            className="title_text"
            placeholder="제목을 입력하세요."
            value={title}
            onChange={handleTitleChange}
          />
        </div>
  
        <div className="content">
          <div className="content_name">내용</div>
          <input type="text" className="content_text" />
        </div>
  
        <div className="post_button">
          <button type="button" className="back_button">뒤로가기</button>
          <button type="submit" className="submit_button">등록</button>
        </div>
      </div>
    );  
}

function CommentPage() {
    return (
        <div>
            <div className="comment">
                <div className="comment_top">
                    <div className="post_title">
                        <h3 className="post_title1">[스타벅스]</h3>
                        <h3 className="post_title2">이거 정말 맛있어요!</h3>
                    </div>

                    <div className="Info">
                        <dl>
                            <dt>작성자</dt>
                            <dd>박성빈</dd>
                        </dl>
                        <div className="Info2">
                            <dl>
                                <dt>날짜</dt>
                                <dd>2024.03.24</dd>
                            </dl>
                            <dl>
                                <dt>조회수</dt>
                                <dd>3회</dd>
                            </dl>
                        </div>
                    </div>
                    <div className="writing">
                        떠나는 길에 네가 내게 말했지<br />
                        너는 바라는 게 너무나 많아<br />
                        잠깐이라도 널 안 바라보면<br />
                        머리에 불이 나버린다니까<br />
                        나는 흐르려는 눈물을 참고<br />
                        하려던 얘길 어렵게 누르고<br />
                        그래, 미안해라는 한 마디로<br />
                        너랑 나눈 날들 마무리했었지<br />
                        달디달고, 달디달고, 달디단, 밤양갱, 밤양갱<br />
                        내가 먹고 싶었던 건, 달디단, 밤양갱, 밤양갱이야<br />
                    </div>
                    <div className="btn_view">
                        <a href="#">수정</a>
                    </div>

                    <div className="reco_box">
                        <div className="btn_reco">
                            <a href="#"><FontAwesomeIcon icon={faThumbsUp} /></a>
                            <div className="reco_cnt">추천 2</div>
                        </div>
                    </div>
                </div>

                <div className="comment_mid">
                    <div className="comment_cnt">댓글 23개</div>
                    <div className="comment1">
                        <div className="user">
                            <div className="user_name">조계현</div>
                            <div className="date">2024.03.24 19:36</div>
                        </div>
                        <div className="write">저도 나중에 먹어보고 싶어요!</div>
                    </div>
                    <div className="comment2">
                        <div className="user">
                            <div className="user_name">조계현</div>
                            <div className="date">2024.03.24 19:36</div>
                        </div>
                        <div className="write">저도 나중에 먹어보고 싶어요!</div>
                    </div>
                    <div className="comment3">
                        <div className="user">
                            <div className="user_name">조계현</div>
                            <div className="date">2024.03.24 19:36</div>
                        </div>
                        <div className="write">저도 나중에 먹어보고 싶어요!</div>
                    </div>
                </div>

                <div className="comment_bottom">
                    <div className="comment_page">
                        <a href="#" className="bt first">&lt;&lt;</a>
                        <a href="#" className="bt prev">&lt;</a>
                        <a href="#" className="num on">1</a>
                        <a href="#" className="num">2</a>
                        <a href="#" className="num">3</a>
                        <a href="#" className="num">4</a>
                        <a href="#" className="num">5</a>
                        <a href="#" className="bt next">&gt;</a>
                        <a href="#" className="bt last">&gt;&gt;</a>
                    </div>

                    <div className="post_search">
                        <select name="post_sort" className="post_sort">
                            <option value="제목/내용 selected">제목/내용</option>
                            <option value="작성자">작성자</option>
                        </select>

                        <input type="text" className="community_searchtext" placeholder=" 검색어를 입력해주세요" />
                        <button type="submit" className="community_searchbtn">검색</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태를 나타내는 상태
    const [name, setUserName] = useState(''); // 로그인한 사용자 이름을 나타내는 상태

    useEffect(() => {
        console.log("isLoggedIn:", isLoggedIn);
        console.log("userName:", name);
    }, [isLoggedIn, name]);

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUserName('');
    };    

    const handleLogin = async (name, password) => {
        console.log('Login attempt:', name);
        try {
            const response = await axios.post('http://localhost:8080/login', { name, password });
            console.log('Login response:', response);
            if (response.status === 200 && response.data) {
                if (response.data.success) {
                    setIsLoggedIn(true);
                    setUserName(name);
                } else {
                    console.log('Login failed:', response.data.message);
                }
            } else {
                console.log('Login failed: Unexpected response');
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    };
    
    return (
        <Router>
            <div>
                <Navbar isLoggedIn={isLoggedIn} name={name} onLogout={handleLogout} />
                <Routes>
                    {/* {isLoggedIn ? (
                        <>
                            <Route path="/logininhomepage" element={<LoginHomePage />} />
                            <Route path="/brandpage" element={<BrandPage />} />
                        </>
                    ) : (
                        <>
                            <Route path="/logouthomepage" element={<LogoutHomePage />} />
                            <Route path="/brandpage" element={<BrandPage />} />
                        </>
                    )} */}
                    <Route path="/sign" element={<SignUpPage />} />
                    <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
                    <Route path="/signformpage" element={<SignFormPage />} />
                    <Route path="/loginformpage" element={<LoginFormPage />} />
                    <Route path="/searchidpage" element={<SearchIDPage />} />
                    <Route path="/searchidform" element={<SearchIdForm />} />
                    <Route path="/searchpwform" element={<SearchPwForm />} />
                    <Route path="/kakaologin" element={<KakaoLoginPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                    <Route path="/brandpage" element={<BrandPage />} />
                    <Route path="/loginhomepage" element={<LoginHomePage />} />
                    <Route path="/logouthomepage" element={<LogoutHomePage />} />
                    <Route path="/starpage" element={<StarPage />} />
                    <Route path="/todaypage" element={<TodayPage />} />
                    <Route path="/communitypage" element={<CommunityPage />} />
                    <Route path="/postpage" element={<PostPage />} />
                    <Route path="/commentpage" element={<CommentPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;