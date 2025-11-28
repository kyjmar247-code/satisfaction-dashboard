import Papa from 'papaparse'

/**
 * 지점명과 권역/그룹 매핑 (실제 데이터 기준)
 * 계층: 권역 > 그룹 > 지점
 */
const locationMapping = {
  // 수도권 - 그룹 1
  '강남': { region: '수도권', group: '1' },
  '서울서초': { region: '수도권', group: '1' },
  
  // 수도권 - 그룹 2
  '강북': { region: '수도권', group: '2' },
  '서울노원': { region: '수도권', group: '2' },
  '서울성북': { region: '수도권', group: '2' },
  '서울도봉': { region: '수도권', group: '2' },
  '의정부': { region: '수도권', group: '2' },
  
  // 수도권 - 그룹 3
  '마포': { region: '수도권', group: '3' },
  '은평서대문': { region: '수도권', group: '3' },
  
  // 수도권 - 그룹 4
  '목동': { region: '수도권', group: '4' },
  '목동오목교': { region: '수도권', group: '4' },
  '서울강서': { region: '수도권', group: '4' },
  
  // 수도권 - 그룹 5
  '서울강동': { region: '수도권', group: '5' },
  '서울송파': { region: '수도권', group: '5' },
  '하남': { region: '수도권', group: '5' },
  
  // 수도권 - 그룹 6
  '서울광진': { region: '수도권', group: '6' },
  '서울성동': { region: '수도권', group: '6' },
  '구리남양주': { region: '수도권', group: '6' },
  
  // 수도권 - 그룹 7
  '서울대점': { region: '수도권', group: '7' },
  '광명': { region: '수도권', group: '7' },
  '노량진': { region: '수도권', group: '7' },
  
  // 수도권 - 그룹 8
  '분당정자': { region: '수도권', group: '8' },
  '분당이매': { region: '수도권', group: '8' },
  '용인수지': { region: '수도권', group: '8' },
  
  // 수도권 - 그룹 9
  '수원시청': { region: '수도권', group: '9' },
  '수원영통': { region: '수도권', group: '9' },
  '안산': { region: '수도권', group: '9' },
  '수원정자': { region: '수도권', group: '9' },
  
  // 수도권 - 그룹 10
  '일산동구': { region: '수도권', group: '10' },
  '일산서구': { region: '수도권', group: '10' },
  '일산화정': { region: '수도권', group: '10' },
  '파주': { region: '수도권', group: '10' },
  
  // 수도권 - 그룹 11
  '동탄': { region: '수도권', group: '11' },
  '평택': { region: '수도권', group: '11' },
  
  // 수도권 - 그룹 12
  '김포': { region: '수도권', group: '12' },
  '부천': { region: '수도권', group: '12' },
  '인천부평': { region: '수도권', group: '12' },
  '인천송도': { region: '수도권', group: '12' },
  '인천청라': { region: '수도권', group: '12' },
  
  // 강원/제주 - 그룹 13
  '원주': { region: '강원/제주', group: '13' },
  '춘천': { region: '강원/제주', group: '13' },
  
  // 강원/제주 - 그룹 14
  '제주': { region: '강원/제주', group: '14' },
  
  // 충청 - 그룹 15
  '대전둔산': { region: '충청', group: '15' },
  
  // 충청 - 그룹 16
  '천안': { region: '충청', group: '16' },
  '청주': { region: '충청', group: '16' },
  
  // 전라 - 그룹 17
  '광주광산': { region: '전라', group: '17' },
  '광주남구': { region: '전라', group: '17' },
  '광주동구': { region: '전라', group: '17' },
  '광주북구': { region: '전라', group: '17' },
  '광주수완': { region: '전라', group: '17' },
  
  // 전라 - 그룹 18
  '목포': { region: '전라', group: '18' },
  '익산': { region: '전라', group: '18' },
  '전주완산': { region: '전라', group: '18' },
  
  // 경상 - 그룹 19
  '대구달서': { region: '경상', group: '19' },
  '대구수성 1관': { region: '경상', group: '19' },
  '대구수성 2관': { region: '경상', group: '19' },
  '대구수성1관': { region: '경상', group: '19' },
  '대구수성2관': { region: '경상', group: '19' },
  
  // 경상 - 그룹 20
  '부산대': { region: '경상', group: '20' },
  '부산교대': { region: '경상', group: '20' },
  '부산북구': { region: '경상', group: '20' },
  '부산서면': { region: '경상', group: '20' },
  '부산해운대': { region: '경상', group: '20' },
  '울산남구': { region: '경상', group: '20' },
  
  // 경상 - 그룹 21
  '창원': { region: '경상', group: '21' },
  '진주': { region: '경상', group: '21' },
  
  // 기숙
  '안성기숙학원': { region: '기숙', group: '기숙' },
  '양평기숙학원': { region: '기숙', group: '기숙' },
  '독학기숙학원': { region: '기숙', group: '기숙' }
}

/**
 * 지점명에서 권역과 그룹을 추론
 * 매핑에 없는 경우 지점명을 기반으로 추론
 */
function inferRegionAndGroup(location) {
  if (!location) return { region: '기타', group: '기타' }
  
  // 정확한 매핑이 있는 경우
  if (locationMapping[location]) {
    return locationMapping[location]
  }
  
  // 부분 매칭으로 추론 (매핑에 없는 경우)
  
  // 기숙
  if (location.includes('기숙')) {
    return { region: '기숙', group: '기숙' }
  }
  
  // 강원/제주
  if (location.includes('제주')) {
    return { region: '강원/제주', group: '14' }
  }
  if (location.includes('춘천') || location.includes('원주')) {
    return { region: '강원/제주', group: '13' }
  }
  
  // 충청
  if (location.includes('대전')) {
    return { region: '충청', group: '15' }
  }
  if (location.includes('천안') || location.includes('청주')) {
    return { region: '충청', group: '16' }
  }
  
  // 전라
  if (location.includes('광주')) {
    return { region: '전라', group: '17' }
  }
  if (location.includes('목포') || location.includes('익산') || location.includes('전주')) {
    return { region: '전라', group: '18' }
  }
  
  // 경상
  if (location.includes('대구')) {
    return { region: '경상', group: '19' }
  }
  if (location.includes('부산') || location.includes('울산')) {
    return { region: '경상', group: '20' }
  }
  if (location.includes('창원') || location.includes('진주')) {
    return { region: '경상', group: '21' }
  }
  
  // 수도권 (서울, 경기, 인천 포함)
  // 그룹 추론은 복잡하므로 기본값 사용
  if (location.includes('서울') || location.includes('수원') || location.includes('분당') ||
      location.includes('인천') || location.includes('안산') || location.includes('평택') ||
      location.includes('의정부') || location.includes('김포') || location.includes('부천') ||
      location.includes('파주') || location.includes('하남') || location.includes('용인') ||
      location.includes('광명') || location.includes('동탄') || location.includes('목동') ||
      location.includes('일산') || location.includes('구리') || location.includes('남양주') ||
      location.includes('노량진') || location.includes('마포') || location.includes('강남') ||
      location.includes('강북') || location.includes('성북') || location.includes('성동') ||
      location.includes('송파') || location.includes('강서') || location.includes('광진') ||
      location.includes('노원') || location.includes('도봉') || location.includes('서초') ||
      location.includes('강동') || location.includes('은평') || location.includes('서대문')) {
    return { region: '수도권', group: '기타' }
  }
  
  // 기본값
  return { region: '기타', group: '기타' }
}

function getDefaultMapping(location) {
  const mapping = inferRegionAndGroup(location)
  return {
    ...mapping,
    location: location || '기타'
  }
}

/**
 * CSV 파일 로드
 */
export async function loadData() {
  // GitHub Pages base URL을 고려한 경로
  const baseUrl = import.meta.env.BASE_URL || '/'
  const dataUrl = `${baseUrl}converted/2025 하반기 재원생 만족도조사 데이터 및 문항속성_챗GPT_데이터.csv`
  const metadataUrl = `${baseUrl}converted/2025 하반기 재원생 만족도조사 데이터 및 문항속성_챗GPT_문항 및 보기.csv`
  
  console.log('CSV 파일 로드 시도:', { dataUrl, metadataUrl })
  
  let dataResponse, metadataResponse
  
  try {
    [dataResponse, metadataResponse] = await Promise.all([
      fetch(dataUrl),
      fetch(metadataUrl)
    ])
  } catch (error) {
    console.error('Fetch 에러:', error)
    throw new Error(`CSV 파일을 가져올 수 없습니다: ${error.message}`)
  }

  if (!dataResponse.ok) {
    throw new Error(`데이터 CSV 파일을 불러올 수 없습니다. (상태: ${dataResponse.status}) URL: ${dataUrl}`)
  }
  
  if (!metadataResponse.ok) {
    throw new Error(`메타데이터 CSV 파일을 불러올 수 없습니다. (상태: ${metadataResponse.status}) URL: ${metadataUrl}`)
  }

  const dataText = await dataResponse.text()
  const metadataText = await metadataResponse.text()

  const dataPromise = new Promise((resolve, reject) => {
    Papa.parse(dataText, {
      header: true,
      skipEmptyLines: true,
      encoding: 'UTF-8',
      complete: resolve,
      error: reject
    })
  })

  const metadataPromise = new Promise((resolve, reject) => {
    Papa.parse(metadataText, {
      header: true,
      skipEmptyLines: true,
      encoding: 'UTF-8',
      complete: resolve,
      error: reject
    })
  })

  const [dataResult, metadataResult] = await Promise.all([dataPromise, metadataPromise])

  return {
    data: dataResult.data,
    metadata: metadataResult.data
  }
}

/**
 * 데이터 전처리
 */
export function processData(rawData, questionMetadata) {
  try {
    console.log('데이터 처리 시작:', {
      rawDataLength: rawData?.length || 0,
      metadataLength: questionMetadata?.length || 0
    })
    
    if (!rawData || !Array.isArray(rawData)) {
      console.error('processData: rawData가 유효하지 않음', rawData)
      return []
    }
    
    if (!questionMetadata || !Array.isArray(questionMetadata)) {
      console.error('processData: questionMetadata가 유효하지 않음', questionMetadata)
      return []
    }
    
    // 문항 메타데이터 정리
    const questions = {}
  const questionInfo = {}

  questionMetadata.forEach(row => {
    const sectionNo = row['섹션No'] || row['sectionNo']
    const questionNo = row['문항No'] || row['questionNo']
    const questionText = row['문항'] || row['question']
    const optionNo = row['보기No'] || row['optionNo']
    const optionText = row['보기'] || row['option']

    const questionCode = `${sectionNo} ${questionNo}`
    
    if (!questions[questionCode]) {
      questions[questionCode] = {
        code: questionCode,
        name: questionText,
        section: sectionNo,
        options: []
      }
      questionInfo[questionCode] = questions[questionCode]
    }

    if (optionNo && optionText) {
      questions[questionCode].options.push({
        no: optionNo,
        text: optionText
      })
    }
  })

  // 불만족 옵션 확인 (보기 텍스트에 "불만족"이 포함된 경우)
  Object.keys(questions).forEach(code => {
    questions[code].hasUnsatisfiedOption = questions[code].options.some(opt => 
      opt.text && opt.text.includes('불만족')
    )
  })

  // 데이터 처리
  return rawData.map((row, index) => {
    const location = row['지점'] || row['location'] || ''
    const mapping = locationMapping[location] || getDefaultMapping(location)
    
    const processed = {
      id: row['No'] || index,
      location: location,
      region: mapping.region,
      group: mapping.group,
      respondent: row['응시자'] || row['respondent'] || '',
      status: row['원생상태'] || row['status'] || '',
      grade: getGrade(row['S1 Q1']), // 학년 정보
      responses: {},
      unsatisfiedResponses: [],
      additionalResponses: [], // 추가 문항 응답 (학년구분, 입학시기, 선택 이유 등)
      rawRow: row // 원본 데이터 보관 (차트 데이터 추출용)
    }

    // 추가 문항 코드 정의 (학년구분, 입학시기, 선택 이유 등)
    const additionalQuestionCodes = {
      'A1': '학년 구분',
      'A2': '입학시기',
      'A3': '자기주도학습_독학_ 중심의 학습환경을 선택한 이유는 무엇인가요',
      'A4': '이투스247학원을 선택하게 된 이유는 무엇인가요'
    }
    
    // S1 Q1~Q4도 추가 문항으로 처리
    const additionalS1Codes = {
      'S1 Q1': '학년 구분',
      'S1 Q2': '입학시기',
      'S1 Q3': '자기주도학습_독학_ 중심의 학습환경을 선택한 이유는 무엇인가요',
      'S1 Q4': '이투스247학원을 선택하게 된 이유는 무엇인가요'
    }

    // 모든 문항 응답 수집
    Object.keys(row).forEach(key => {
      // 추가 문항 처리
      if (additionalQuestionCodes[key] || additionalS1Codes[key]) {
        const value = row[key]
        if (value && value.toString().trim() !== '') {
          const questionCode = key
          const questionName = additionalQuestionCodes[key] || additionalS1Codes[key]
          
          // 주관식 답변 찾기 (다음 컬럼이나 관련 컬럼)
          let textResponse = ''
          
          // 다음 컬럼 확인
          if (key.match(/^S1 Q(\d+)$/)) {
            const qNum = parseInt(key.match(/^S1 Q(\d+)$/)[1])
            const nextKey = `S1 Q${qNum + 1}`
            
            if (row[nextKey]) {
              const nextValue = row[nextKey].toString().trim()
              if (nextValue.length > 3 && !/^\d+$/.test(nextValue) && !nextValue.match(/^[S]\d+ Q\d+$/)) {
                textResponse = nextValue
              }
            }
          }
          
          // 주관식 관련 컬럼 찾기
          if (!textResponse) {
            const textFields = Object.keys(row).filter(k => {
              const val = (row[k] || '').toString().trim()
              return (k.toLowerCase().includes('이유') || 
                      k.toLowerCase().includes('자유') ||
                      k.toLowerCase().includes('기타')) &&
                     val.length > 10 &&
                     k !== key
            })
            
            if (textFields.length > 0) {
              textResponse = row[textFields[0]] || ''
            }
          }
          
          // 현재 문항 주변의 긴 텍스트 찾기
          if (!textResponse) {
            const allKeys = Object.keys(row).sort()
            const currentIndex = allKeys.indexOf(key)
            
            for (let i = Math.max(0, currentIndex - 1); i <= Math.min(allKeys.length - 1, currentIndex + 3); i++) {
              const checkKey = allKeys[i]
              const checkValue = (row[checkKey] || '').toString().trim()
              
              if (checkValue.length > 15 && 
                  !/^[\d.,\s]+$/.test(checkValue) &&
                  !checkValue.match(/^[S]\d+ Q\d+$/) &&
                  checkKey !== key) {
                textResponse = checkValue
                break
              }
            }
          }
          
          // 응답 값 자체가 긴 텍스트인 경우
          const responseValue = value.toString().trim()
          if (responseValue.length > 20 && !/^\d+$/.test(responseValue)) {
            textResponse = responseValue
          }
          
          processed.additionalResponses.push({
            questionCode: questionCode,
            questionName: questionName,
            location: location,
            region: mapping.region,
            group: mapping.group,
            respondent: processed.respondent,
            grade: processed.grade,
            score: responseValue,
            textResponse: textResponse || responseValue || '(응답 없음)'
          })
        }
      }
      
      if (key.match(/^S\d+ Q\d+$/) && !additionalS1Codes[key]) {
        // S1 Q1~Q4는 추가 문항으로 이미 처리했으므로 제외
        const value = row[key]
        if (value && value.toString().trim() !== '') {
          processed.responses[key] = value
          
          const questionCode = key.replace('S', 'S').replace(' Q', ' Q')
          const question = questions[questionCode]
          
          // S3 Q6 (보강점)은 모든 주관식 응답 포함
          if (questionCode === 'S3 Q6') {
            const responseText = value.toString().trim()
            let textResponse = responseText
            
            // 긴 텍스트인 경우 주관식 응답으로 간주
            if (textResponse.length > 10 && !/^\d+$/.test(textResponse)) {
              // S3 Q5(보강점 선택) 정보 가져오기
              let s3q5Info = ''
              const s3q5Value = row['S3 Q5'] || row['S3Q5']
              if (s3q5Value) {
                const s3q5Text = s3q5Value.toString().trim()
                // S3 Q5 값을 보기 텍스트로 변환
                const s3q5Mapping = {
                  '1': '학습관리',
                  '2': '생활관리',
                  '3': '입시 관리',
                  '4': '정기적 상담',
                  '5': '학습공간 및 시설',
                  '6': '무료로 제공하는 학습 콘텐츠',
                  '7': '기타'
                }
                
                // 다중 선택인 경우 (예: "1,2,3")
                const s3q5Parts = s3q5Text.split(',').map(p => p.trim()).filter(p => p !== '')
                const s3q5Labels = s3q5Parts.map(part => {
                  const match = part.match(/^(\d+)/)
                  if (match) {
                    return s3q5Mapping[match[1]] || `보기 ${match[1]}`
                  }
                  return part
                })
                
                if (s3q5Labels.length > 0) {
                  s3q5Info = `[보강점: ${s3q5Labels.join(', ')}] `
                }
              }
              
              processed.unsatisfiedResponses.push({
                questionCode: questionCode,
                questionName: question ? question.name : '보강점',
                location: location,
                region: mapping.region,
                group: mapping.group,
                respondent: processed.respondent,
                grade: processed.grade,
                score: '',
                isUnsatisfied: false, // 보강점은 불만족이 아니지만 분류를 위해 포함
                textResponse: s3q5Info + textResponse
              })
            }
          }
          
          // 불만족 응답 확인
          // S3 Q3, S2 Q1, S2 Q4, S2 Q8, S3 Q2는 항상 확인 (hasUnsatisfiedOption과 관계없이)
          const shouldCheckUnsatisfied = (question && question.hasUnsatisfiedOption) || questionCode === 'S3 Q3' || questionCode === 'S2 Q1' || questionCode === 'S2 Q4' || questionCode === 'S2 Q8' || questionCode === 'S3 Q2'
          
          if (shouldCheckUnsatisfied) {
            const responseText = value.toString().trim()
            
            // 불만족 여부 확인 (더 포괄적으로)
            let isUnsatisfied = responseText.includes('불만족') || 
                               responseText === '2' || 
                               responseText.startsWith('2.') ||
                               responseText.startsWith('2 ') ||
                               /^2[\.\s]/.test(responseText)
            
            // S3 Q3, S2 Q1, S2 Q4, S2 Q8, S3 Q2의 경우 특별 처리
            if (questionCode === 'S3 Q3' || questionCode === 'S2 Q1' || questionCode === 'S2 Q4' || questionCode === 'S2 Q8' || questionCode === 'S3 Q2') {
              // 숫자 값도 확인 (보기 2번이 불만족)
              if (!isUnsatisfied) {
                const numValue = parseInt(responseText)
                if (numValue === 2) {
                  isUnsatisfied = true
                }
              }
              
              // 값이 선택지 패턴이 아닌 긴 텍스트인 경우 (실제 데이터에서 주관식 답변이 직접 들어있는 경우)
              // 예: "가성비가 안좋고 생각보다 면학분위기를 잘잡지못했다고 느껴서"
              // 예: "학습관리를 받아본 적이 아직 없음"
              if (!isUnsatisfied && responseText.length >= 10) {
                const isOptionPattern = /^[1-7]\./.test(responseText) || 
                                       responseText.match(/^\d+\.\s*[가-힣]+/) ||
                                       responseText.match(/^\d+\.\s*기타/) ||
                                       /^[\d.,\s]+$/.test(responseText) ||
                                       responseText === '1' || 
                                       responseText === '2' ||
                                       responseText === '1. 만족' ||
                                       responseText.match(/^1\.?\s*만족/) ||
                                       responseText === '2. 불만족' ||
                                       responseText.match(/^2\.?\s*불만족/)
                
                // 선택지 패턴이 아니고 한글이 포함된 긴 텍스트면 불만족 주관식 답변으로 처리
                if (!isOptionPattern && /[가-힣]/.test(responseText)) {
                  isUnsatisfied = true
                }
              }
            }
            
            if (isUnsatisfied) {
              // 주관식 답변 찾기 - 다음 컬럼이나 관련 컬럼에서 찾기
              let textResponse = ''

              // S3 Q3(전반적인 만족도)의 경우 특별 처리
              if (questionCode === 'S3 Q3') {
                // 0. S3 Q3 값 자체가 주관식 답변인 경우 (선택지가 아닌 긴 텍스트)
                // 예: "가성비가 안좋고 생각보다 면학분위기를 잘잡지못했다고 느껴서"
                if (responseText.length >= 10) {
                  const isOptionPattern = /^[1-7]\./.test(responseText) || 
                                         responseText.match(/^\d+\.\s*[가-힣]+/) ||
                                         responseText.match(/^\d+\.\s*기타/) ||
                                         /^[\d.,\s]+$/.test(responseText) ||
                                         responseText === '1' || 
                                         responseText === '2' ||
                                         responseText === '1. 만족' ||
                                         responseText.match(/^1\.?\s*만족/)
                  
                  // 선택지 패턴이 아니고 한글이 포함된 긴 텍스트면 주관식 답변으로 처리
                  if (!isOptionPattern && /[가-힣]/.test(responseText)) {
                    textResponse = responseText
                  }
                }
                
                // 1. 값 안에 "이유 :"가 함께 들어있는 경우 (다양한 패턴 지원)
                if (!textResponse) {
                  const reasonPatterns = [
                    /이유\s*[:：]\s*(.+)$/i,  // "이유 : 답변"
                    /불만족[,\s]*이유\s*[:：]\s*(.+)$/i,  // "불만족, 이유 : 답변"
                    /2\.?\s*불만족[,\s]*이유\s*[:：]\s*(.+)$/i,  // "2. 불만족, 이유 : 답변"
                    /[,，]\s*(.+)$/  // 쉼표 뒤의 텍스트 (예: "2. 불만족, 답변")
                  ]
                  
                  for (const pattern of reasonPatterns) {
                    const match = responseText.match(pattern)
                    if (match && match[1] && match[1].trim().length > 0) {
                      const extracted = match[1].trim()
                      // 선택지 패턴이 아닌 경우만 사용
                      if (!extracted.match(/^\d+\.\s*[가-힣]+/) && 
                          !/^[1-7]\./.test(extracted) &&
                          extracted.length >= 3) {
                        textResponse = extracted
                        break
                      }
                    }
                  }
                }
                
                // 3. 다음 컬럼(S3 Q4) 확인 - 선택지가 아닌 텍스트 응답인지 확인
                // 실제 데이터에서 S3 Q3의 주관식 답변이 S3 Q4 컬럼에 있는 경우가 있음
                if (!textResponse) {
                  const match = key.match(/S(\d+) Q(\d+)/)
                  if (match) {
                    const section = match[1]
                    const qNum = parseInt(match[2])
                    const nextKey = `S${section} Q${qNum + 1}`
                    
                    if (row[nextKey]) {
                      const nextValue = row[nextKey].toString().trim()
                      
                      // S3 Q4의 경우: 선택지 패턴이 아니고, 긴 텍스트(10자 이상)인 경우 주관식 답변으로 간주
                      // 선택지 패턴: "1.", "2.", "6. 기타" 등으로 시작하거나 숫자만 있는 경우
                      const isOptionPattern = /^[1-7]\./.test(nextValue) || 
                                             nextValue.match(/^\d+\.\s*[가-힣]+/) ||
                                             nextValue.match(/^\d+\.\s*기타/) ||
                                             /^[\d.,\s]+$/.test(nextValue) ||
                                             nextValue.match(/^[S]\d+ Q\d+$/)
                      
                      // 긴 텍스트이고 선택지 패턴이 아닌 경우 주관식 답변으로 처리
                      if (nextValue.length >= 10 && !isOptionPattern) {
                        textResponse = nextValue
                      }
                      // 짧은 텍스트(5자 이상)이지만 명확히 주관식 답변인 경우 (한글이 포함된 경우)
                      else if (nextValue.length >= 5 && 
                               !isOptionPattern &&
                               /[가-힣]/.test(nextValue)) {  // 한글이 포함된 경우만
                        textResponse = nextValue
                      }
                    }
                  }
                }
                
                // 4. 같은 행에서 "이유" 관련 컬럼 찾기
                if (!textResponse) {
                  const textFields = Object.keys(row).filter(k => {
                    const val = (row[k] || '').toString().trim()
                    // 컬럼명에 "이유"가 포함되어 있고, 텍스트 응답인 경우
                    return (k.toLowerCase().includes('이유') || 
                            k.toLowerCase().includes('reason')) &&
                           val.length >= 5 &&
                           !/^[\d.,\s]+$/.test(val) &&
                           !val.match(/^\d+\.\s*[가-힣]+/) &&
                           !/^[1-7]\./.test(val)
                  })
                  
                  if (textFields.length > 0) {
                    textResponse = row[textFields[0]] || ''
                  }
                }
                
                // 5. 같은 셀에서 "2. 불만족" 뒤의 모든 텍스트 추출 (이유 키워드 없이도)
                if (!textResponse && responseText.includes('불만족')) {
                  const afterUnsatisfied = responseText.split(/불만족[,\s]*/i)[1]
                  if (afterUnsatisfied && afterUnsatisfied.trim().length >= 3) {
                    const cleaned = afterUnsatisfied.replace(/^이유\s*[:：]\s*/i, '').trim()
                    if (cleaned.length >= 3 && 
                        !cleaned.match(/^\d+\.\s*[가-힣]+/) && 
                        !/^[1-7]\./.test(cleaned)) {
                      textResponse = cleaned
                    }
                  }
                }
                
                // 6. 주변 컬럼에서 텍스트 찾기 (S3 Q4도 확인하되, 선택지 패턴이 아닌 경우만)
                if (!textResponse) {
                  const allKeys = Object.keys(row).sort()
                  const currentIndex = allKeys.indexOf(key)
                  
                  // S3 Q3 주변 컬럼 확인 (S3 Q4 포함, 하지만 선택지 패턴이 아닌 경우만)
                  for (let i = Math.max(0, currentIndex + 1); i <= Math.min(allKeys.length - 1, currentIndex + 10); i++) {
                    const checkKey = allKeys[i]
                    const checkValue = (row[checkKey] || '').toString().trim()
                    
                    // 선택지 패턴 확인
                    const isOptionPattern = /^[1-7]\./.test(checkValue) || 
                                           checkValue.match(/^\d+\.\s*[가-힣]+/) ||
                                           checkValue.match(/^\d+\.\s*기타/) ||
                                           /^[\d.,\s]+$/.test(checkValue) ||
                                           checkValue.match(/^[S]\d+ Q\d+$/)
                    
                    // 긴 텍스트이고 선택지 패턴이 아닌 경우 주관식 답변으로 처리
                    if (checkValue.length >= 10 && !isOptionPattern) {
                      textResponse = checkValue
                      break
                    }
                    // 짧은 텍스트(5자 이상)이지만 한글이 포함되고 선택지 패턴이 아닌 경우
                    else if (checkValue.length >= 5 && 
                             !isOptionPattern &&
                             /[가-힣]/.test(checkValue)) {
                      textResponse = checkValue
                      break
                    }
                  }
                }
                
                // 7. 디버깅: 주관식 답변을 찾지 못한 경우 로그 출력
                if (!textResponse && questionCode === 'S3 Q3') {
                  console.log('S3 Q3 주관식 답변을 찾지 못함:', {
                    responseText,
                    rowIndex: index,
                    location: location,
                    nearbyKeys: Object.keys(row).filter(k => {
                      const val = (row[k] || '').toString().trim()
                      return val.length >= 3 && k !== key
                    }).slice(0, 5)
                  })
                }
              } else if (questionCode === 'S2 Q1') {
                // S2 Q1(학습관리 만족도)의 경우 S3 Q3와 동일한 로직 적용
                // 0. S2 Q1 값 자체가 주관식 답변인 경우 (선택지가 아닌 긴 텍스트)
                // 예: "학습관리를 받아본 적이 아직 없음", "홈페이지에서 접한 다양한 학습 관리를..."
                if (responseText.length >= 10) {
                  const isOptionPattern = /^[1-7]\./.test(responseText) || 
                                         responseText.match(/^\d+\.\s*[가-힣]+/) ||
                                         responseText.match(/^\d+\.\s*기타/) ||
                                         /^[\d.,\s]+$/.test(responseText) ||
                                         responseText === '1' || 
                                         responseText === '2' ||
                                         responseText === '1. 만족' ||
                                         responseText.match(/^1\.?\s*만족/) ||
                                         responseText === '2. 불만족' ||
                                         responseText.match(/^2\.?\s*불만족/)
                  
                  // 선택지 패턴이 아니고 한글이 포함된 긴 텍스트면 주관식 답변으로 처리
                  if (!isOptionPattern && /[가-힣]/.test(responseText)) {
                    textResponse = responseText
                  }
                }
                
                // 1. 값 안에 "이유 :"가 함께 들어있는 경우
                if (!textResponse) {
                  const reasonPatterns = [
                    /이유\s*[:：]\s*(.+)$/i,
                    /불만족[,\s]*이유\s*[:：]\s*(.+)$/i,
                    /2\.?\s*불만족[,\s]*이유\s*[:：]\s*(.+)$/i,
                    /[,，]\s*(.+)$/
                  ]
                  
                  for (const pattern of reasonPatterns) {
                    const match = responseText.match(pattern)
                    if (match && match[1] && match[1].trim().length > 0) {
                      const extracted = match[1].trim()
                      if (!extracted.match(/^\d+\.\s*[가-힣]+/) && 
                          !/^[1-7]\./.test(extracted) &&
                          extracted.length >= 3) {
                        textResponse = extracted
                        break
                      }
                    }
                  }
                }
                
                // 2. 다음 컬럼(S2 Q2) 확인 - 선택지가 아닌 텍스트 응답인지 확인
                if (!textResponse) {
                  const match = key.match(/S(\d+) Q(\d+)/)
                  if (match) {
                    const section = match[1]
                    const qNum = parseInt(match[2])
                    const nextKey = `S${section} Q${qNum + 1}`
                    
                    if (row[nextKey]) {
                      const nextValue = row[nextKey].toString().trim()
                      
                      // S2 Q2는 선택지 문항이므로, 선택지 패턴이 아니고 긴 텍스트인 경우만 주관식 답변으로 간주
                      const isOptionPattern = /^[1-7]\./.test(nextValue) || 
                                             nextValue.match(/^\d+\.\s*[가-힣]+/) ||
                                             nextValue.match(/^\d+\.\s*기타/) ||
                                             /^[\d.,\s]+$/.test(nextValue) ||
                                             nextValue.match(/^[S]\d+ Q\d+$/)
                      
                      if (nextValue.length >= 10 && !isOptionPattern) {
                        textResponse = nextValue
                      }
                      else if (nextValue.length >= 5 && 
                               !isOptionPattern &&
                               /[가-힣]/.test(nextValue)) {
                        textResponse = nextValue
                      }
                    }
                  }
                }
                
                // 3. 같은 행에서 "이유" 관련 컬럼 찾기
                if (!textResponse) {
                  const textFields = Object.keys(row).filter(k => {
                    const val = (row[k] || '').toString().trim()
                    return (k.toLowerCase().includes('이유') || 
                            k.toLowerCase().includes('reason')) &&
                           val.length >= 5 &&
                           !/^[\d.,\s]+$/.test(val) &&
                           !val.match(/^\d+\.\s*[가-힣]+/) &&
                           !/^[1-7]\./.test(val)
                  })
                  
                  if (textFields.length > 0) {
                    textResponse = row[textFields[0]] || ''
                  }
                }
                
                // 4. 같은 셀에서 "2. 불만족" 뒤의 모든 텍스트 추출
                if (!textResponse && responseText.includes('불만족')) {
                  const afterUnsatisfied = responseText.split(/불만족[,\s]*/i)[1]
                  if (afterUnsatisfied && afterUnsatisfied.trim().length >= 3) {
                    const cleaned = afterUnsatisfied.replace(/^이유\s*[:：]\s*/i, '').trim()
                    if (cleaned.length >= 3 && 
                        !cleaned.match(/^\d+\.\s*[가-힣]+/) && 
                        !/^[1-7]\./.test(cleaned)) {
                      textResponse = cleaned
                    }
                  }
                }
                
                // 5. 주변 컬럼에서 텍스트 찾기
                if (!textResponse) {
                  const allKeys = Object.keys(row).sort()
                  const currentIndex = allKeys.indexOf(key)
                  
                  for (let i = Math.max(0, currentIndex + 1); i <= Math.min(allKeys.length - 1, currentIndex + 10); i++) {
                    const checkKey = allKeys[i]
                    const checkValue = (row[checkKey] || '').toString().trim()
                    
                    const isOptionPattern = /^[1-7]\./.test(checkValue) || 
                                           checkValue.match(/^\d+\.\s*[가-힣]+/) ||
                                           checkValue.match(/^\d+\.\s*기타/) ||
                                           /^[\d.,\s]+$/.test(checkValue) ||
                                           checkValue.match(/^[S]\d+ Q\d+$/)
                    
                    if (checkValue.length >= 10 && !isOptionPattern) {
                      textResponse = checkValue
                      break
                    }
                    else if (checkValue.length >= 5 && 
                             !isOptionPattern &&
                             /[가-힣]/.test(checkValue)) {
                      textResponse = checkValue
                      break
                    }
                  }
                }
              } else if (questionCode === 'S2 Q4') {
                // S2 Q4(생활관리 만족도)의 경우 S2 Q1과 동일한 로직 적용
                // 0. S2 Q4 값 자체가 주관식 답변인 경우 (선택지가 아닌 긴 텍스트)
                if (responseText.length >= 10) {
                  const isOptionPattern = /^[1-7]\./.test(responseText) || 
                                         responseText.match(/^\d+\.\s*[가-힣]+/) ||
                                         responseText.match(/^\d+\.\s*기타/) ||
                                         /^[\d.,\s]+$/.test(responseText) ||
                                         responseText === '1' || 
                                         responseText === '2' ||
                                         responseText === '1. 만족' ||
                                         responseText.match(/^1\.?\s*만족/) ||
                                         responseText === '2. 불만족' ||
                                         responseText.match(/^2\.?\s*불만족/)
                  
                  // 선택지 패턴이 아니고 한글이 포함된 긴 텍스트면 주관식 답변으로 처리
                  if (!isOptionPattern && /[가-힣]/.test(responseText)) {
                    textResponse = responseText
                  }
                }
                
                // 1. 값 안에 "이유 :"가 함께 들어있는 경우
                if (!textResponse) {
                  const reasonPatterns = [
                    /이유\s*[:：]\s*(.+)$/i,
                    /불만족[,\s]*이유\s*[:：]\s*(.+)$/i,
                    /2\.?\s*불만족[,\s]*이유\s*[:：]\s*(.+)$/i,
                    /[,，]\s*(.+)$/
                  ]
                  
                  for (const pattern of reasonPatterns) {
                    const match = responseText.match(pattern)
                    if (match && match[1] && match[1].trim().length > 0) {
                      const extracted = match[1].trim()
                      if (!extracted.match(/^\d+\.\s*[가-힣]+/) && 
                          !/^[1-7]\./.test(extracted) &&
                          extracted.length >= 3) {
                        textResponse = extracted
                        break
                      }
                    }
                  }
                }
                
                // 2. 다음 컬럼(S2 Q5) 확인 - 선택지가 아닌 텍스트 응답인지 확인
                if (!textResponse) {
                  const match = key.match(/S(\d+) Q(\d+)/)
                  if (match) {
                    const section = match[1]
                    const qNum = parseInt(match[2])
                    const nextKey = `S${section} Q${qNum + 1}`
                    
                    if (row[nextKey]) {
                      const nextValue = row[nextKey].toString().trim()
                      
                      // 선택지 패턴이 아니고 긴 텍스트인 경우만 주관식 답변으로 간주
                      const isOptionPattern = /^[1-7]\./.test(nextValue) || 
                                             nextValue.match(/^\d+\.\s*[가-힣]+/) ||
                                             nextValue.match(/^\d+\.\s*기타/) ||
                                             /^[\d.,\s]+$/.test(nextValue) ||
                                             nextValue.match(/^[S]\d+ Q\d+$/)
                      
                      if (nextValue.length >= 10 && !isOptionPattern) {
                        textResponse = nextValue
                      }
                      else if (nextValue.length >= 5 && 
                               !isOptionPattern &&
                               /[가-힣]/.test(nextValue)) {
                        textResponse = nextValue
                      }
                    }
                  }
                }
                
                // 3. 같은 행에서 "이유" 관련 컬럼 찾기
                if (!textResponse) {
                  const textFields = Object.keys(row).filter(k => {
                    const val = (row[k] || '').toString().trim()
                    return (k.toLowerCase().includes('이유') || 
                            k.toLowerCase().includes('reason')) &&
                           val.length >= 5 &&
                           !/^[\d.,\s]+$/.test(val) &&
                           !val.match(/^\d+\.\s*[가-힣]+/) &&
                           !/^[1-7]\./.test(val)
                  })
                  
                  if (textFields.length > 0) {
                    textResponse = row[textFields[0]] || ''
                  }
                }
                
                // 4. 같은 셀에서 "2. 불만족" 뒤의 모든 텍스트 추출
                if (!textResponse && responseText.includes('불만족')) {
                  const afterUnsatisfied = responseText.split(/불만족[,\s]*/i)[1]
                  if (afterUnsatisfied && afterUnsatisfied.trim().length >= 3) {
                    const cleaned = afterUnsatisfied.replace(/^이유\s*[:：]\s*/i, '').trim()
                    if (cleaned.length >= 3 && 
                        !cleaned.match(/^\d+\.\s*[가-힣]+/) && 
                        !/^[1-7]\./.test(cleaned)) {
                      textResponse = cleaned
                    }
                  }
                }
                
                // 5. 주변 컬럼에서 텍스트 찾기 (S2 Q4의 경우 같은 섹션 내에서만, 최대 1개 컬럼까지만)
                if (!textResponse) {
                  const allKeys = Object.keys(row).sort()
                  const currentIndex = allKeys.indexOf(key)
                  
                  // S2 Q4, S2 Q8의 경우 같은 섹션(S2) 내에서만 검색하고, 최대 1개 컬럼까지만 확인
                  // S2 Q4: S2 Q5는 선택지 문항이므로 제외하고, S2 Q6 이후는 다른 문항이므로 제외
                  // S2 Q8: S2 Q9는 선택지 문항이므로 제외하고, S2 Q10 이후는 다른 문항이므로 제외
                  const maxCheck = (questionCode === 'S2 Q4' || questionCode === 'S2 Q8') ? 1 : 10
                  
                  for (let i = Math.max(0, currentIndex + 1); i <= Math.min(allKeys.length - 1, currentIndex + maxCheck); i++) {
                    const checkKey = allKeys[i]
                    const checkValue = (row[checkKey] || '').toString().trim()
                    
                    // S2 Q4, S2 Q8의 경우 같은 섹션(S2) 내에서만 검색하고, 특정 문항 이후는 제외
                    if (questionCode === 'S2 Q4' || questionCode === 'S2 Q8') {
                      const checkMatch = checkKey.match(/^S(\d+) Q(\d+)$/)
                      const currentMatch = key.match(/^S(\d+) Q(\d+)$/)
                      if (checkMatch && currentMatch) {
                        // 다른 섹션이거나, 특정 문항 이후는 제외
                        if (checkMatch[1] !== currentMatch[1]) {
                          continue
                        }
                        // S2 Q4: S2 Q5 이후 제외
                        if (questionCode === 'S2 Q4' && parseInt(checkMatch[2]) > 5) {
                          continue
                        }
                        // S2 Q8: S2 Q9 이후 제외
                        if (questionCode === 'S2 Q8' && parseInt(checkMatch[2]) > 9) {
                          continue
                        }
                      }
                    }
                    
                    const isOptionPattern = /^[1-7]\./.test(checkValue) || 
                                           checkValue.match(/^\d+\.\s*[가-힣]+/) ||
                                           checkValue.match(/^\d+\.\s*기타/) ||
                                           /^[\d.,\s]+$/.test(checkValue) ||
                                           checkValue.match(/^[S]\d+ Q\d+$/)
                    
                    if (checkValue.length >= 10 && !isOptionPattern) {
                      textResponse = checkValue
                      break
                    }
                    else if (checkValue.length >= 5 && 
                             !isOptionPattern &&
                             /[가-힣]/.test(checkValue)) {
                      textResponse = checkValue
                      break
                    }
                  }
                }
              } else if (questionCode === 'S2 Q8') {
                // S2 Q8(상담 만족도)의 경우 S2 Q4와 동일한 로직 적용
                // 0. S2 Q8 값 자체가 주관식 답변인 경우 (선택지가 아닌 긴 텍스트)
                if (responseText.length >= 10) {
                  const isOptionPattern = /^[1-7]\./.test(responseText) || 
                                         responseText.match(/^\d+\.\s*[가-힣]+/) ||
                                         responseText.match(/^\d+\.\s*기타/) ||
                                         /^[\d.,\s]+$/.test(responseText) ||
                                         responseText === '1' || 
                                         responseText === '2' ||
                                         responseText === '1. 만족' ||
                                         responseText.match(/^1\.?\s*만족/) ||
                                         responseText === '2. 불만족' ||
                                         responseText.match(/^2\.?\s*불만족/)
                  
                  // 선택지 패턴이 아니고 한글이 포함된 긴 텍스트면 주관식 답변으로 처리
                  if (!isOptionPattern && /[가-힣]/.test(responseText)) {
                    textResponse = responseText
                  }
                }
                
                // 1. 값 안에 "이유 :"가 함께 들어있는 경우
                if (!textResponse) {
                  const reasonPatterns = [
                    /이유\s*[:：]\s*(.+)$/i,
                    /불만족[,\s]*이유\s*[:：]\s*(.+)$/i,
                    /2\.?\s*불만족[,\s]*이유\s*[:：]\s*(.+)$/i,
                    /[,，]\s*(.+)$/
                  ]
                  
                  for (const pattern of reasonPatterns) {
                    const match = responseText.match(pattern)
                    if (match && match[1] && match[1].trim().length > 0) {
                      const extracted = match[1].trim()
                      if (!extracted.match(/^\d+\.\s*[가-힣]+/) && 
                          !/^[1-7]\./.test(extracted) &&
                          extracted.length >= 3) {
                        textResponse = extracted
                        break
                      }
                    }
                  }
                }
                
                // 2. 다음 컬럼 확인 - S2 Q8의 경우 S2 Q9는 선택지 문항이므로 제외
                if (!textResponse) {
                  const match = key.match(/S(\d+) Q(\d+)/)
                  if (match) {
                    const section = match[1]
                    const qNum = parseInt(match[2])
                    const nextKey = `S${section} Q${qNum + 1}`
                    
                    // S2 Q8의 경우 S2 Q9는 선택지 문항이므로 제외
                    if (questionCode === 'S2 Q8' && nextKey === 'S2 Q9') {
                      // S2 Q9는 건너뛰기
                    } else if (row[nextKey]) {
                      const nextValue = row[nextKey].toString().trim()
                      
                      // 선택지 패턴이 아니고 긴 텍스트인 경우만 주관식 답변으로 간주
                      const isOptionPattern = /^[1-7]\./.test(nextValue) || 
                                             nextValue.match(/^\d+\.\s*[가-힣]+/) ||
                                             nextValue.match(/^\d+\.\s*기타/) ||
                                             /^[\d.,\s]+$/.test(nextValue) ||
                                             nextValue.match(/^[S]\d+ Q\d+$/)
                      
                      if (nextValue.length >= 10 && !isOptionPattern) {
                        textResponse = nextValue
                      }
                      else if (nextValue.length >= 5 && 
                               !isOptionPattern &&
                               /[가-힣]/.test(nextValue)) {
                        textResponse = nextValue
                      }
                    }
                  }
                }
                
                // 3. 같은 행에서 "이유" 관련 컬럼 찾기
                if (!textResponse) {
                  const textFields = Object.keys(row).filter(k => {
                    const val = (row[k] || '').toString().trim()
                    return (k.toLowerCase().includes('이유') || 
                            k.toLowerCase().includes('reason')) &&
                           val.length >= 5 &&
                           !/^[\d.,\s]+$/.test(val) &&
                           !val.match(/^\d+\.\s*[가-힣]+/) &&
                           !/^[1-7]\./.test(val)
                  })
                  
                  if (textFields.length > 0) {
                    textResponse = row[textFields[0]] || ''
                  }
                }
                
                // 4. 같은 셀에서 "2. 불만족" 뒤의 모든 텍스트 추출
                if (!textResponse && responseText.includes('불만족')) {
                  const afterUnsatisfied = responseText.split(/불만족[,\s]*/i)[1]
                  if (afterUnsatisfied && afterUnsatisfied.trim().length >= 3) {
                    const cleaned = afterUnsatisfied.replace(/^이유\s*[:：]\s*/i, '').trim()
                    if (cleaned.length >= 3 && 
                        !cleaned.match(/^\d+\.\s*[가-힣]+/) && 
                        !/^[1-7]\./.test(cleaned)) {
                      textResponse = cleaned
                    }
                  }
                }
                
                // 5. 주변 컬럼에서 텍스트 찾기 (S2 Q8의 경우 S2 Q9는 선택지 문항이므로 주변 컬럼 검색 제외)
                if (!textResponse) {
                  // S2 Q8의 경우 S2 Q9가 선택지 문항이므로 주변 컬럼 검색을 하지 않음
                  if (questionCode === 'S2 Q8') {
                    // 주변 컬럼 검색 건너뛰기
                  } else {
                    const allKeys = Object.keys(row).sort()
                    const currentIndex = allKeys.indexOf(key)
                    
                    // 최대 10개 컬럼까지 확인
                    for (let i = Math.max(0, currentIndex + 1); i <= Math.min(allKeys.length - 1, currentIndex + 10); i++) {
                      const checkKey = allKeys[i]
                      const checkValue = (row[checkKey] || '').toString().trim()
                      
                      const isOptionPattern = /^[1-7]\./.test(checkValue) || 
                                             checkValue.match(/^\d+\.\s*[가-힣]+/) ||
                                             checkValue.match(/^\d+\.\s*기타/) ||
                                             /^[\d.,\s]+$/.test(checkValue) ||
                                             checkValue.match(/^[S]\d+ Q\d+$/)
                      
                      if (checkValue.length >= 10 && !isOptionPattern) {
                        textResponse = checkValue
                        break
                      }
                      else if (checkValue.length >= 5 && 
                               !isOptionPattern &&
                               /[가-힣]/.test(checkValue)) {
                        textResponse = checkValue
                        break
                      }
                    }
                  }
                }
              } else if (questionCode === 'S3 Q2') {
                // S3 Q2(시설 만족도)의 경우 S2 Q8과 동일한 로직 적용
                // 0. S3 Q2 값 자체가 주관식 답변인 경우 (선택지가 아닌 긴 텍스트)
                if (responseText.length >= 10) {
                  const isOptionPattern = /^[1-7]\./.test(responseText) || 
                                         responseText.match(/^\d+\.\s*[가-힣]+/) ||
                                         responseText.match(/^\d+\.\s*기타/) ||
                                         /^[\d.,\s]+$/.test(responseText) ||
                                         responseText === '1' || 
                                         responseText === '2' ||
                                         responseText === '1. 만족' ||
                                         responseText.match(/^1\.?\s*만족/) ||
                                         responseText === '2. 불만족' ||
                                         responseText.match(/^2\.?\s*불만족/)
                  
                  // 선택지 패턴이 아니고 한글이 포함된 긴 텍스트면 주관식 답변으로 처리
                  if (!isOptionPattern && /[가-힣]/.test(responseText)) {
                    textResponse = responseText
                  }
                }
                
                // 1. 값 안에 "이유 :"가 함께 들어있는 경우
                if (!textResponse) {
                  const reasonPatterns = [
                    /이유\s*[:：]\s*(.+)$/i,
                    /불만족[,\s]*이유\s*[:：]\s*(.+)$/i,
                    /2\.?\s*불만족[,\s]*이유\s*[:：]\s*(.+)$/i,
                    /[,，]\s*(.+)$/
                  ]
                  
                  for (const pattern of reasonPatterns) {
                    const match = responseText.match(pattern)
                    if (match && match[1] && match[1].trim().length > 0) {
                      const extracted = match[1].trim()
                      if (!extracted.match(/^\d+\.\s*[가-힣]+/) && 
                          !/^[1-7]\./.test(extracted) &&
                          extracted.length >= 3) {
                        textResponse = extracted
                        break
                      }
                    }
                  }
                }
                
                // 2. 다음 컬럼(S3 Q3) 확인 - S3 Q3는 전반적인 만족도이므로 제외
                if (!textResponse) {
                  const match = key.match(/S(\d+) Q(\d+)/)
                  if (match) {
                    const section = match[1]
                    const qNum = parseInt(match[2])
                    const nextKey = `S${section} Q${qNum + 1}`
                    
                    // S3 Q2의 경우 S3 Q3는 전반적인 만족도이므로 제외
                    if (questionCode === 'S3 Q2' && nextKey === 'S3 Q3') {
                      // S3 Q3는 건너뛰기
                    } else if (row[nextKey]) {
                      const nextValue = row[nextKey].toString().trim()
                      
                      // 선택지 패턴이 아니고 긴 텍스트인 경우만 주관식 답변으로 간주
                      const isOptionPattern = /^[1-7]\./.test(nextValue) || 
                                             nextValue.match(/^\d+\.\s*[가-힣]+/) ||
                                             nextValue.match(/^\d+\.\s*기타/) ||
                                             /^[\d.,\s]+$/.test(nextValue) ||
                                             nextValue.match(/^[S]\d+ Q\d+$/)
                      
                      if (nextValue.length >= 10 && !isOptionPattern) {
                        textResponse = nextValue
                      }
                      else if (nextValue.length >= 5 && 
                               !isOptionPattern &&
                               /[가-힣]/.test(nextValue)) {
                        textResponse = nextValue
                      }
                    }
                  }
                }
                
                // 3. 같은 행에서 "이유" 관련 컬럼 찾기
                if (!textResponse) {
                  const textFields = Object.keys(row).filter(k => {
                    const val = (row[k] || '').toString().trim()
                    return (k.toLowerCase().includes('이유') || 
                            k.toLowerCase().includes('reason')) &&
                           val.length >= 5 &&
                           !/^[\d.,\s]+$/.test(val) &&
                           !val.match(/^\d+\.\s*[가-힣]+/) &&
                           !/^[1-7]\./.test(val)
                  })
                  
                  if (textFields.length > 0) {
                    textResponse = row[textFields[0]] || ''
                  }
                }
                
                // 4. 같은 셀에서 "2. 불만족" 뒤의 모든 텍스트 추출
                if (!textResponse && responseText.includes('불만족')) {
                  const afterUnsatisfied = responseText.split(/불만족[,\s]*/i)[1]
                  if (afterUnsatisfied && afterUnsatisfied.trim().length >= 3) {
                    const cleaned = afterUnsatisfied.replace(/^이유\s*[:：]\s*/i, '').trim()
                    if (cleaned.length >= 3 && 
                        !cleaned.match(/^\d+\.\s*[가-힣]+/) && 
                        !/^[1-7]\./.test(cleaned)) {
                      textResponse = cleaned
                    }
                  }
                }
                
                // 5. 주변 컬럼에서 텍스트 찾기 (S3 Q2의 경우 S3 Q3는 전반적인 만족도이므로 주변 컬럼 검색 제외)
                if (!textResponse) {
                  // S3 Q2의 경우 S3 Q3가 전반적인 만족도이므로 주변 컬럼 검색을 하지 않음
                  if (questionCode === 'S3 Q2') {
                    // 주변 컬럼 검색 건너뛰기
                  } else {
                    const allKeys = Object.keys(row).sort()
                    const currentIndex = allKeys.indexOf(key)
                    
                    // 최대 10개 컬럼까지 확인
                    for (let i = Math.max(0, currentIndex + 1); i <= Math.min(allKeys.length - 1, currentIndex + 10); i++) {
                      const checkKey = allKeys[i]
                      const checkValue = (row[checkKey] || '').toString().trim()
                      
                      const isOptionPattern = /^[1-7]\./.test(checkValue) || 
                                             checkValue.match(/^\d+\.\s*[가-힣]+/) ||
                                             checkValue.match(/^\d+\.\s*기타/) ||
                                             /^[\d.,\s]+$/.test(checkValue) ||
                                             checkValue.match(/^[S]\d+ Q\d+$/)
                      
                      if (checkValue.length >= 10 && !isOptionPattern) {
                        textResponse = checkValue
                        break
                      }
                      else if (checkValue.length >= 5 && 
                               !isOptionPattern &&
                               /[가-힣]/.test(checkValue)) {
                        textResponse = checkValue
                        break
                      }
                    }
                  }
                }
              } else {
                // S3 Q3, S2 Q1, S2 Q4, S2 Q8, S3 Q2가 아닌 다른 문항의 경우 기존 로직 사용
                // 1. 다음 컬럼 확인 (일부 문항은 다음 컬럼이 이유/자유 응답)
                const match = key.match(/S(\d+) Q(\d+)/)
                if (match) {
                  const section = match[1]
                  const qNum = parseInt(match[2])
                  const nextKey = `S${section} Q${qNum + 1}`
                  
                  // 다음 문항의 값이 텍스트 응답일 수 있음
                  if (row[nextKey]) {
                    const nextValue = row[nextKey].toString().trim()
                    // 텍스트 응답인지 확인 (짧은 숫자가 아닌 경우)
                    if (nextValue.length > 3 && !/^\d+$/.test(nextValue)) {
                      textResponse = nextValue
                    }
                  }
                }
                
                // 2. 같은 행에서 주관식 관련 컬럼 찾기
                if (!textResponse) {
                  const textFields = Object.keys(row).filter(k => {
                    const val = (row[k] || '').toString().trim()
                    // 이유, 자유, 기타 등의 키워드가 있거나, 긴 텍스트 값
                    return (k.toLowerCase().includes('이유') || 
                            k.toLowerCase().includes('자유') ||
                            k.toLowerCase().includes('기타')) &&
                           val.length > 10
                  })
                  
                  if (textFields.length > 0) {
                    textResponse = row[textFields[0]] || ''
                  }
                }
                
                // 3. 현재 문항 주변의 모든 컬럼에서 긴 텍스트 찾기
                if (!textResponse) {
                  const allKeys = Object.keys(row).sort()
                  const currentIndex = allKeys.indexOf(key)
                  
                  // 현재 문항 주변 3개 컬럼 확인
                  for (let i = Math.max(0, currentIndex - 1); i <= Math.min(allKeys.length - 1, currentIndex + 3); i++) {
                    const checkKey = allKeys[i]
                    const checkValue = (row[checkKey] || '').toString().trim()
                    
                    // 긴 텍스트이고 숫자가 아닌 경우
                    if (checkValue.length > 15 && 
                        !/^[\d.,\s]+$/.test(checkValue) &&
                        !checkValue.match(/^[S]\d+ Q\d+$/)) {
                      textResponse = checkValue
                      break
                    }
                  }
                }
              }

              // 불만족 응답 추가 (주관식 답변이 없어도 추가)
              processed.unsatisfiedResponses.push({
                questionCode: questionCode,
                questionName: question.name,
                location: location,
                region: mapping.region,
                group: mapping.group,
                respondent: processed.respondent,
                grade: processed.grade,
                score: responseText,
                isUnsatisfied: true,
                textResponse: textResponse || '(주관식 답변 없음)'
              })
            }
          }
        }
      }
    })

    return processed
  })
  
  console.log('데이터 처리 완료:', {
    processedLength: processed.length,
    sampleProcessed: processed.length > 0 ? processed[0] : null
  })
  
  return processed
  } catch (error) {
    console.error('데이터 처리 중 에러 발생:', error)
    console.error('에러 상세:', error.message, error.stack)
    return []
  }
}

/**
 * 학년 정보 추출
 */
function getGrade(value) {
  if (!value) return '미상'
  
  const val = value.toString()
  if (val.includes('재학생') || val === '1') return '재학생'
  if (val.includes('재수생') || val === '2') return '재수생'
  if (val.includes('삼수') || val === '3') return '삼수이상'
  if (val.includes('검정고시') || val === '4') return '검정고시'
  
  return val
}

