import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useRanking() {
  const [rankings, setRankings] = useState([])
  const [myRanking, setMyRanking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [seasonId, setSeasonId] = useState(null)

  useEffect(() => {
    async function findSeason() {
      const { data } = await supabase
        .from('seasons')
        .select('id')
        .eq('name', 'Temporada 2026')
        .single()
      if (data) setSeasonId(data.id)
    }
    findSeason()
  }, [])

  useEffect(() => {
    if (seasonId) fetchRankings()
  }, [seasonId])

  async function fetchRankings() {
    setLoading(true)
    const { data, error } = await supabase
      .from('rankings')
      .select(`*, profiles(full_name, avatar_url, company)`)
      .eq('season_id', seasonId)
      .order('position', { ascending: true })
      .limit(100)

    if (error) {
      console.error('Erro ao buscar ranking:', error)
      setLoading(false)
      return
    }

    setRankings(data || [])

    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const myRank = data?.find(r => r.profile_id === user.id)
      setMyRanking(myRank)
    }
    setLoading(false)
  }

  return { rankings, myRanking, loading, refetch: fetchRankings }
}
