package com.example.tradex_service.Controller;

import com.example.tradex_service.DAO.DaoImpl.OrderDaoImpl;
import com.example.tradex_service.Mapper.OrderMapper;
import com.example.tradex_service.Models.Order;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class OrderDaoImplTest {

    @Mock
    private OrderMapper orderMapper;

    @InjectMocks
    private OrderDaoImpl orderDaoImpl;

    @Mock
    private Order mockOrder;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void insertOrder_shouldReturnNumberOfRowsInserted() {
        when(orderMapper.insert(mockOrder)).thenReturn(1);

        int result = orderDaoImpl.insertOrder(mockOrder);

        assertEquals(1, result);
        verify(orderMapper, times(1)).insert(mockOrder);
    }

    @Test
    void findById_shouldReturnOrder() {
        when(orderMapper.findById("order-123")).thenReturn(mockOrder);
        when(mockOrder.getOrderId()).thenReturn("order-123");

        Order result = orderDaoImpl.findById("order-123");

        assertNotNull(result);
        assertEquals("order-123", result.getOrderId());
        verify(orderMapper, times(1)).findById("order-123");
    }

    @Test
    void findByClient_shouldReturnListOfOrders() {
        List<Order> mockOrders = Arrays.asList(mockOrder, mockOrder);
        when(orderMapper.findByClient("client-abc")).thenReturn(mockOrders);

        List<Order> result = orderDaoImpl.findByClient("client-abc");

        assertNotNull(result);
        assertEquals(2, result.size());
        verify(orderMapper, times(1)).findByClient("client-abc");
    }
}