select
  *
from
  (
    select
      tbl.*,
      gm2.msg,
      if (gm2.user_from = '${id}', 1, 0) isSend,
      u.full_name fullNameSend
    from
      (
        select
          gc.id,
          gc.name,
          gc.img_url imgUrl,
          max(gm.created_time) gmCreatedTime
        from
          group_chat gc
          inner join members_of_group mog on gc.id = mog.group_id
          left join group_msg gm on gc.id = gm.group_to
        where
          mog.user_id = '${id}'
        group by
          gc.id
      ) tbl
      left join group_msg gm2 on tbl.gmCreatedTime = gm2.created_time
      and tbl.id = gm2.group_to
      inner join users u on gm2.user_from = u.id
    union
    all
    select
      if (m.user0 = '${id}', m.user1, m.user0) id,
      if (
        m.user0 = '${id}',
        (
          select
            u.full_name
          from
            users u
          where
            u.id = m.user1
        ),
        (
          select
            u.full_name
          from
            users u
          where
            u.id = m.user0
        )
      ) name,
      if (
        m.user0 = '${id}',
        (
          select
            u.img_url
          from
            users u
          where
            u.id = m.user1
        ),
        (
          select
            u.img_url
          from
            users u
          where
            u.id = m.user0
        )
      ) imgUrl,
      m.created_time gmCreatedTime,
      m.msg,
      if (
        m.user0 = '${id}'
        and m.is_user0_send = 1,
        1,
        0
      ) isSend,
      null fullNameSend
    from
      msg m
      inner join (
        select
          user0,
          user1,
          max(created_time) mCreatedTime
        from
          msg m
        where
          '${id}' in (user0, user1)
        group by
          user0,
          user1
      ) tbl on m.user0 = tbl.user0
      and m.user1 = tbl.user1
      and m.created_time = tbl.mCreatedTime
  ) tbl0
order by
  tbl0.gmCreatedTime desc