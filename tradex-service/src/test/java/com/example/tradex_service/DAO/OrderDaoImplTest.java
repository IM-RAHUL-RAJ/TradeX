//package com.example.tradex_service.DAO;
//
//
//import com.example.tradex_service.DAO.DaoImpl.OrderDaoImpl;
//import com.example.tradex_service.Mapper.OrderMapper;
//import com.example.tradex_service.Models.Order;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.mockito.*;
//
//import java.util.ArrayList;
//import java.util.List;
//
//import static org.junit.jupiter.api.Assertions.*;
//import static org.mockito.Mockito.*;
//
//class OrderDaoImplTest {
//
//    @Mock
//    private OrderMapper orderMapper;
//
//    @InjectMocks
//    private OrderDaoImpl orderDao;
//
//    @BeforeEach
//    void setUp() {
//        MockitoAnnotations.openMocks(this);
//    }
//
//    @Test
//    void insertOrderDelegatesToMapper() {
//        Order order = new Order();
//        when(orderMapper.insert(order)).thenReturn(1);
//
//        int result = orderDao.insertOrder(order);
//
//        assertEquals(1, result);
//        verify(orderMapper).insert(order);
//    }
//
//    @Test
//    void findByIdDelegatesToMapper() {
//        String orderId = "ORD123";
//        Order order = new Order();
//        when(orderMapper.findById(orderId)).thenReturn(order);
//
//        Order result = orderDao.findById(orderId);
//
//        assertSame(order, result);
//        verify(orderMapper).findById(orderId);
//    }
//
//    @Test
//    void findByClientDelegatesToMapper() {
//        String clientId = "CL123";
//        List<Order> orders = new ArrayList<>();
//        when(orderMapper.findByClient(clientId)).thenReturn(orders);
//
//        List<Order> result = orderDao.findByClient(clientId);
//
//        assertSame(orders, result);
//        verify(orderMapper).findByClient(clientId);
//    }
//}
//
