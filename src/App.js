import './App.css';
import {useState, useRef} from "react";
// 크롤링, 호출
import axios from "axios";
import * as cheerio from 'cheerio';
// MUI
import {Box, Button, Container, TextField} from "@mui/material";
// 컴포넌트
import Board from "./component/Board";
// 유틸 함수
import {customAlert} from "./utils/commonUtil";

function App() {

    const [url, setUrl] = useState('');

    const urlInput = useRef();

    /**
     * 확인버튼 클릭 시 이벤트
     * @param e
     */
    const onSubmitHandler = (e) => {
        e.preventDefault();
        getHtml()
            .then(response => {
                const $ = cheerio.load(response.data);
                getProduct($("[name=keywords]")[0].attribs.content)
                    .then(response => {
                        console.log(response);
                    });
            }).catch(err => {
                customAlert({
                    icon : 'error',
                    title: 'Oops...',
                    text : 'URL이 정상적이지 않습니다.'
                }).then(() => {
                    setUrl('');
                    urlInput.current.focus();
                });
            }
        )
    }

    /**
     * 크롤링 하기위해 HTML 가져오는 함수
     * @returns {Promise<any>}
     */
    const getHtml = async () => {
        const getUrl = new URL(url);
        const useUrl = getUrl.pathname + getUrl.search;
        return await axios.get('v1/keywords' + useUrl);
    };

    const getProduct = async (keyWords) => {
        // return keyWords.split(',')[0];
        return await axios.get(`v1/products?query=${keyWords.split(',')[0]}`, {
            headers: {
                'X-Naver-Client-Id'    : 'ZGhIupvDFQrrIS5y9yMQ',
                'X-Naver-Client-Secret': '5UzL6W7AYT'
            }
        })
    }

    /**
     * URL 입력 시 이벤트
     * @param e
     */
    const onUrlHandler = (e) => {
        setUrl(e.currentTarget.value);
    }

    return (
        <Container>
            <Box
                component="form"
                onSubmit={onSubmitHandler}
                sx={{
                    marginTop    : 8,
                    display      : 'flex',
                    flexDirection: 'column',
                    alignItems   : 'center',
                }}
            >
                <TextField variant="standard" autoFocus fullWidth label="URL을 입력해주세요." value={url} ref={urlInput}
                           onChange={onUrlHandler}/>
                <Button type="submit" fullWidth variant="contained" sx={{mt: 3, mb: 2}} disabled={!url}>확인</Button>
                <Board/>
            </Box>
        </Container>
    );
}

export default App;
