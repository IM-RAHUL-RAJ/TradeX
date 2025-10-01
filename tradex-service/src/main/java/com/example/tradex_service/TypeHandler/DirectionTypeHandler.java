package com.example.tradex_service.TypeHandler;

import com.example.tradex_service.Models.Direction;
import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;
import java.sql.*;

public class DirectionTypeHandler extends BaseTypeHandler<Direction> {

    @Override
    public void setNonNullParameter(PreparedStatement ps, int i, Direction parameter, JdbcType jdbcType) throws SQLException {
        ps.setString(i, String.valueOf(parameter.getCode()));  // 'B' or 'S'
    }

    @Override
    public Direction getNullableResult(ResultSet rs, String columnName) throws SQLException {
        String code = rs.getString(columnName);
        if (code == null || code.isEmpty()) return null;
        return Direction.fromCode(code.charAt(0));
    }

    @Override
    public Direction getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
        String code = rs.getString(columnIndex);
        if (code == null || code.isEmpty()) return null;
        return Direction.fromCode(code.charAt(0));
    }

    @Override
    public Direction getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
        String code = cs.getString(columnIndex);
        if (code == null || code.isEmpty()) return null;
        return Direction.fromCode(code.charAt(0));
    }
}
