/**
 * 계층별 필터링
 */
export function filterByHierarchy(data, filters) {
  return data.filter(row => {
    if (filters.region !== '전체' && row.region !== filters.region) {
      return false
    }
    if (filters.group !== '전체' && row.group !== filters.group) {
      return false
    }
    if (filters.location !== '전체' && row.location !== filters.location) {
      return false
    }
    return true
  })
}

/**
 * 메트릭 계산
 */
export function calculateMetrics(data) {
  if (!data || data.length === 0) {
    return {
      overallSatisfaction: 0,
      recommendation: 0,
      reenrollment: 0,
      unsatisfactionRate: 0
    }
  }

  // 전체 만족도 평균 (S3 Q3: 전반적 만족도)
  // 값: 1. 만족 = 5점, 2. 불만족 = 1점으로 변환
  const overallSatisfactionScores = data
    .map(row => {
      const value = row.responses['S3 Q3']
      if (!value) return null
      
      const valStr = value.toString()
      if (valStr.includes('만족') && !valStr.includes('불만족')) return 5
      if (valStr.includes('불만족')) return 1
      if (valStr === '1') return 5
      if (valStr === '2') return 1
      
      // 숫자 점수인 경우 (1-5 척도)
      const num = parseFloat(valStr)
      if (!isNaN(num) && num >= 1 && num <= 5) return num
      
      return null
    })
    .filter(v => v !== null)

  const overallSatisfaction = overallSatisfactionScores.length > 0
    ? overallSatisfactionScores.reduce((a, b) => a + b, 0) / overallSatisfactionScores.length
    : 0

  // 추천 의향 (S1 Q9: 어떻게 처음 인지하게 되었나요에서 추천 관련 응답)
  // 실제 문항이 다를 수 있으니 수정 필요
  const recommendationScores = data
    .map(row => {
      const value = row.responses['S1 Q9'] || row.responses['S3 Q4']
      if (!value) return null
      
      const valStr = value.toString()
      // 추천 관련 옵션이 선택된 경우
      if (valStr.includes('추천')) return 5
      if (valStr.includes('1') || valStr.includes('2') || valStr.includes('3') || valStr.includes('4')) return 4
      
      const num = parseFloat(valStr)
      if (!isNaN(num) && num >= 1 && num <= 5) return num
      
      return null
    })
    .filter(v => v !== null)

  const recommendation = recommendationScores.length > 0
    ? recommendationScores.reduce((a, b) => a + b, 0) / recommendationScores.length
    : 0

  // 재등록 의향 (S7 섹션에서 재등록 관련 문항 찾기)
  // 실제 문항이 다를 수 있으니 수정 필요
  const reenrollmentScores = data
    .map(row => {
      // S7 섹션의 문항 중 재등록 관련 찾기
      const s7Keys = Object.keys(row.responses).filter(k => k.startsWith('S7'))
      if (s7Keys.length === 0) return null
      
      // 첫 번째 S7 응답을 사용 (실제로는 재등록 의향 문항을 찾아야 함)
      const value = row.responses[s7Keys[0]]
      if (!value) return null
      
      const num = parseFloat(value.toString())
      if (!isNaN(num) && num >= 1 && num <= 5) return num
      
      return null
    })
    .filter(v => v !== null)

  const reenrollment = reenrollmentScores.length > 0
    ? reenrollmentScores.reduce((a, b) => a + b, 0) / reenrollmentScores.length
    : 0

  // 불만족 비율
  const unsatisfiedCount = data.filter(row => {
    // 전반적 만족도가 불만족인 경우
    const overall = row.responses['S3 Q3']
    if (!overall) return false
    
    const valStr = overall.toString()
    return valStr.includes('불만족') || valStr === '2' || valStr.startsWith('2.')
  }).length

  const unsatisfactionRate = data.length > 0 ? unsatisfiedCount / data.length : 0

  return {
    overallSatisfaction,
    recommendation,
    reenrollment,
    unsatisfactionRate
  }
}

